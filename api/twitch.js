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
        },
        get: {
            'Authorization': `Bearer ${TWITCH_TOKEN}`,
            'Client-Id': `${TWITCH_CLIENT_ID}`,
            'Content-Type': 'application/json'
        },
        delete: {
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

async function getSubscribedEvents() {
    try {
        await instance.get('/eventsub/subscriptions').then(reponse => {
            console.log(reponse.data.data.forEach(element => {
                console.log(`Status: ${element.status} | ID: ${element.id} | UserID: ${element.condition.broadcaster_user_id}`)
            }));
        });
    } catch (error) {
        console.error(error);
    }
}

async function getUsers(userName) {
    try {
        await instance.get(`/users?login=${userName}`).then(response => {
            for (let userObject of response.data.data) {
                console.log(`Login: ${userObject['login']} ID: ${userObject['id']} Profile Pic: ${userObject['profile_image_url']}`);
            }
        });
    } catch (error) {
        console.error(error);
    }
}

async function deleteSubscribedEvent(eventId) {
    try {
        await instance.delete(`/eventsub/subscriptions?id=${eventId}`).then(reponse => {
            console.log(reponse.status);
        });
    } catch (error) {
        console.error(error.response.data);
    }
}

// TODO: Outro GET para pegar o título da live (https://dev.twitch.tv/docs/api/reference#get-channel-information)

// getUsers('azhariel&login=c0muninja&login=comuna_paint&login=dadosrevolucionarios&login=0froggy&login=gamerdeesquerda&login=historiapublica&login=historiatopia&login=lucaszawacki&login=ponzuzuju&login=vinnydays');
// getSubscribedEvents();
// subscribeToStreamOnline('40463426');
// deleteSubscribedEvent('1ee178ba-2cb1-4275-b630-ae0a75dd513b');

// soberanaIds = [146148785, 590931212, 539161835, 557225670, 40463426, 30865255, 694725890, 502441638, 127274602, 498425402, 49750261]
// done 18/04/22
// soberanaIds.forEach((cur, ind, arr) => { subscribeToStreamOnline(cur) });