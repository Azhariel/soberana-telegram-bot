require('dotenv').config();
const axios = require('axios');

const { API_TOKEN, API_URL, TELEGRAM_CHAT_ID } = process.env;

async function sendMessage(text) {
    const url = `${API_URL}${API_TOKEN}/sendMessage`;
    const data = {
        chat_id: TELEGRAM_CHAT_ID,
        text
    };
    await axios.post(url, data);
}

sendMessage('Teste básico!');