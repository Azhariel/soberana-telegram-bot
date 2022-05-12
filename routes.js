const express = require('express');
const routes = express.Router();
const twitch = require('./methods/twitch');

// HTTPS SERVER
routes.get('/', (req, res) => {
	res.status(200).json(`God's in his heaven`);
});

// Twitch EventSub
routes.post('/eventsub', twitch.handleEventSub);

// Google Auth
routes.get('/auth/google', (req, res) => {
	res.sendStatus(200);
});

module.exports = routes;
