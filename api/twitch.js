require('dotenv').config();
const axios = require('axios').default;

const { TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET,
    TWITCH_TOKEN,
    TWITCH_SECRET_KEY,
    NGROK_SERVER } = process.env;

const instance = axios.create({
    baseURL: 'https://api.twitch.tv/helix',
    headers: {
        post: {
            'Authorization': `Bearer ${TWITCH_TOKEN}`,
            'Client-Id': `${TWITCH_CLIENT_ID}`,
            'Content-Type': 'application/json'
        }
    },
})

async function subscribeToStreamOnline(userId) {

    try {
        await instance.post('/eventsub/subscriptions', {
            "type": "stream.online",
            "version": "1",
            "condition": {
                "broadcaster_user_id": `${userId}`
            },
            "transport": {
                "method": "webhook",
                "callback": `${NGROK_SERVER}/eventsub`,
                "secret": `${TWITCH_SECRET_KEY}`
            }
        });
    } catch (error) {
        console.error(error.response.data);
    }
}

subscribeToStreamOnline('150384125');