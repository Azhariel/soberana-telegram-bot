require('dotenv').config();
const crypto = require('crypto');

const { TWITCH_SECRET_KEY } = process.env;
const { formatStreamOnline } = require('../methods/textFormatters');

// Notification request headers
const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();
// Notification message types
const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
const MESSAGE_TYPE_NOTIFICATION = 'notification';
const MESSAGE_TYPE_REVOCATION = 'revocation';
// Prepend this string to the HMAC that's created from the message
const HMAC_PREFIX = 'sha256=';

// * Auxiliary functions
// Build the message used to get the HMAC.
function getHmacMessage(request) {
    return (request.headers[TWITCH_MESSAGE_ID] +
        request.headers[TWITCH_MESSAGE_TIMESTAMP] +
        request.body);
}

// Get the HMAC.
function getHmac(secret, message) {
    return crypto.createHmac('sha256', secret)
        .update(message)
        .digest('hex');
}

// Verify whether our hash matches the hash that Twitch passed in the header.
function verifyMessage(hmac, verifySignature) {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}

let eventCount = 0;

module.exports = {
    handleEventSub(req, res) {
        let secret = TWITCH_SECRET_KEY;
        let message = getHmacMessage(req);
        let hmac = HMAC_PREFIX + getHmac(secret, message);  // Signature to compare

        if (true === verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE])) {
            // Get JSON object from body, so you can process the message.
            let notification = JSON.parse(req.body);
            eventCount++;
            console.log(`${eventCount}. EventSub created for: ${notification.subscription?.condition?.broadcaster_user_id}`);

            if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
                formatStreamOnline(notification.event);
                console.log(`Event type: ${notification.subscription.type}`);
                console.log(JSON.stringify(notification.event, null, 4));

                res.sendStatus(204);
            }
            else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
                res.set('content-type', 'text/plain');
                res.status(200).send(notification.challenge);
            }
            else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
                res.sendStatus(204);

                console.log(`${notification.subscription.type} notifications revoked!`);
                console.log(`reason: ${notification.subscription.status}`);
                console.log(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
            }
            else {
                res.sendStatus(204);
                console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
            }
        }
        else {
            console.log('403');    // Signatures didn't match.
            res.sendStatus(403);
        }
    }
}