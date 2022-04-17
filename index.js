require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const https = require('https');
const fs = require('fs');

const { TWITCH_SECRET_KEY } = process.env;

const port = 4000;
const app = express();

function main() {
    https.createServer(
        {
            key: fs.readFileSync('./ssl/key.pem'),
            cert: fs.readFileSync('./ssl/cert.pem')
        },
        app
    ).listen(port, () => {
        console.log(`🚀 Listening http://localhost:${port}`);
    })
}

app.get('/', (req, res) => {
    res.send('All is right with the world');
})

app.get('/auth/google', (req, res) => {
    res.sendStatus(200);
})



main();