require('dotenv').config();
const express = require('express');

const port = 4000;
const app = express();


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