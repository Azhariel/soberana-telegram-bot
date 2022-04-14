require('dotenv').config();
const axios = require('../node_modules/axios');

const { TELEGRAM_API_KEY, TELEGRAM_API_URL, TELEGRAM_CHAT_ID } = process.env;

async function sendMessage(text) {
    const url = `${TELEGRAM_API_URL}${TELEGRAM_API_KEY}/sendMessage`;
    const data = {
        chat_id: TELEGRAM_CHAT_ID,
        text
    };
    await axios.post(url, data);
}


module.exports = { sendMessage };