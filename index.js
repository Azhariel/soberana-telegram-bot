require('dotenv').config();
const express = require('express');
const axios = require('axios');

const { SERVER_ROOT_URL, GOOGLE_CALENDAR_CLIENT_ID, GOOGLE_CALENDAR_CLIENT_KEY } = process.env;

const port = 4000;
const app = express();

const redirectURL = '/auth/google';

// Up the server
function main() {
    app.listen(port, () => {
        console.log(`🚀 Listening http://localhost:${port}`);
    })
}

app.get('/auth/google', (req, res) => {
    res.sendStatus(200);
})

main();