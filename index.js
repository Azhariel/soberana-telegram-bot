// * Imports
require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const https = require('https');
const fs = require('fs');
const ngrok = require('ngrok');
const schedule = require('node-schedule');
const { formatStreamOnline, postTodaysEvents } = require('./methods/textFormatters');
const { getSubscribedEvents, deleteSubscribedEvent, subscribeToStreamOnline } = require('./api/twitch');

// * .env
const { TWITCH_SECRET_KEY, NGROK_AUTHTOKEN } = process.env;

// * Twitch
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

// * Server
const port = 4000;
const securePort = 443;
const app = express();
const secureApp = express();
// Need raw message body for signature verification
secureApp.use(express.raw({
    type: 'application/json'
}));


async function startNgrok() {
    const url = await ngrok.connect(securePort, { authtoken: NGROK_AUTHTOKEN });
    console.log(`🚀 Ngrok on ${url}`);
    // Need to reset subscribed events when ngrok URL resets
    resetSubscribedEvents(url);
}

async function resetSubscribedEvents(url) {
    try {
        const currentEvents = await getSubscribedEvents();
        if (currentEvents.length > 0) {
            console.log(`Deleting past subscribed events..`);
            currentEvents.forEach(async (cur) => {
                await deleteSubscribedEvent(cur);
            });
        }
        const soberanaIds = [146148785, 590931212, 539161835, 557225670, 40463426, 30865255, 694725890, 502441638, 127274602, 498425402, 49750261];
        soberanaIds.forEach(async (cur) => {
            await subscribeToStreamOnline(cur, url);
        });

        console.info(`Successfuly reseted subscribed events to new ngrok url!`);
    } catch (error) {
        console.error(error.message);
    }
}

// Runs everyday at 00:00 to post the day's schedule
function scheduleDailyPost() {
    const rule = new schedule.RecurrenceRule();
    rule.hour = 0;
    rule.tz = 'Etc/GMT+3';
    schedule.scheduleJob(rule, postTodaysEvents());
}

// Start HTTP and HTTPS servers
async function main() {
    app.listen(port, () => {
        console.log(`🚀 Listening http://localhost:${port}`);
    });

    https.createServer(
        {
            key: fs.readFileSync('./ssl/key.pem'),
            cert: fs.readFileSync('./ssl/cert.pem')
        },
        secureApp
    ).listen(securePort, () => {
        console.log(`🚀 Listening on https://localhost:${securePort}`);
    });

    await startNgrok();
    scheduleDailyPost();
}

// HTTPS SERVER
secureApp.get('/', (req, res) => {
    res.send(`God's in his heaven`)
});

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

secureApp.post('/eventsub', (req, res) => {
    let secret = TWITCH_SECRET_KEY;
    let message = getHmacMessage(req);
    let hmac = HMAC_PREFIX + getHmac(secret, message);  // Signature to compare

    if (true === verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE])) {
        // ! Need to include more descriptive log of what message came through
        console.log("signatures match");

        // Get JSON object from body, so you can process the message.
        let notification = JSON.parse(req.body);

        if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
            // TODO: Do something with the event's data. -> Send to telegram
            let streamOnline = notification.event;
            formatStreamOnline(streamOnline);
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
});

// HTTP SERVER
app.get('/', (req, res) => {
    res.send(`All's right with the world`);
});

app.get('/auth/google', (req, res) => {
    res.sendStatus(200);
});

main();
