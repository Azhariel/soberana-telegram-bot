// * Imports
require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const ngrok = require('ngrok');
const schedule = require('node-schedule');
const routes = require('./routes.js');
const { postTodaysEvents } = require('./methods/textFormatters');
const { getSubscribedEvents, deleteSubscribedEvent, subscribeToStreamOnline } = require('./api/twitch');

// * .env
const { NGROK_AUTHTOKEN } = process.env;

// * Server
const securePort = 443;
const secureApp = express();
// Need raw message body for signature verification
secureApp.use(express.raw({
    type: 'application/json'
}));

secureApp.use(routes);

// * Auxiliary functions --> should move somewhere else
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
            const stream = await subscribeToStreamOnline(cur, url);
            console.log(`Requested Stream Online sub for ${stream}`);
        })

        console.info(`Successfuly reseted subscribed events to new ngrok url!`);

    } catch (error) {
        console.error(error.message);
    }
}

// Runs everyday at 00:00 to post the day's schedule
const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.tz = 'Etc/GMT+3';
const job = schedule.scheduleJob(rule, () => postTodaysEvents());
// * End of auxiliary functions that should be moved somehwere else <--

// Start HTTP and HTTPS servers
async function main() {
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
}

main();
