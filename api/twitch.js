require('dotenv').config();
const axios = require('axios').default;

const {
	TWITCH_CLIENT_ID,
	TWITCH_CLIENT_SECRET,
	TWITCH_TOKEN,
	TWITCH_SECRET_KEY,
} = process.env;

const instance = axios.create({
	baseURL: 'https://api.twitch.tv/helix',
	headers: {
		post: {
			Authorization: `Bearer ${TWITCH_TOKEN}`,
			'Client-Id': `${TWITCH_CLIENT_ID}`,
			'Content-Type': 'application/json',
		},
		get: {
			Authorization: `Bearer ${TWITCH_TOKEN}`,
			'Client-Id': `${TWITCH_CLIENT_ID}`,
			'Content-Type': 'application/json',
		},
		delete: {
			Authorization: `Bearer ${TWITCH_TOKEN}`,
			'Client-Id': `${TWITCH_CLIENT_ID}`,
			'Content-Type': 'application/json',
		},
	},
});

async function subscribeToStreamOnline(userId, ngrokUrl) {
	try {
		await instance.post('/eventsub/subscriptions', {
			type: 'stream.online',
			version: '1',
			condition: {
				broadcaster_user_id: `${userId}`,
			},
			transport: {
				method: 'webhook',
				callback: `${ngrokUrl}/eventsub`,
				secret: `${TWITCH_SECRET_KEY}`,
			},
		});
		return userId;
	} catch (error) {
		console.error(error.response.data);
	}
}

async function getSubscribedEvents() {
	try {
		let listOfSubscribedEvents = [];
		await instance.get('/eventsub/subscriptions').then((response) => {
			response.data.data.forEach((element) => {
				console.log(
					`Status: ${element.status} | ID: ${element.id} | UserID: ${element.condition.broadcaster_user_id}`
				);
				listOfSubscribedEvents.push(element.id);
			});
		});
		return listOfSubscribedEvents;
	} catch (error) {
		console.error(error);
	}
}

async function getUsers(userName) {
	try {
		await instance.get(`/users?login=${userName}`).then((response) => {
			for (let userObject of response.data.data) {
				console.log(
					`Login: ${userObject['login']} ID: ${userObject['id']} Profile Pic: ${userObject['profile_image_url']}`
				);
			}
		});
	} catch (error) {
		console.error(error);
	}
}

async function deleteSubscribedEvent(eventId) {
	try {
		await instance
			.delete(`/eventsub/subscriptions?id=${eventId}`)
			.then((reponse) => {
				console.log(`Event deleted? ${reponse.status}`);
			});
	} catch (error) {
		console.error(error.response.data);
	}
}

async function getChannelInfo(userId) {
	try {
		const channelInfo = await instance.get(
			`/channels?broadcaster_id=${userId}`
		);
		console.log(
			'🚀 ~ file: twitch.js ~ line 90 ~ getChannelInfo ~ channelInfo',
			channelInfo.data.data[0]
		);
		return channelInfo.data.data[0];
	} catch (error) {
		console.error(error);
	}
}

// TODO Move all of this to tests
// getUsers('azhariel&login=c0muninja&login=comuna_paint&login=dadosrevolucionarios&login=0froggy&login=gamerdeesquerda&login=historiapublica&login=historiatopia&login=lucaszawacki&login=ponzuzuju&login=vinnydays');
// getSubscribedEvents();
// subscribeToStreamOnline('40463426');
// deleteSubscribedEvent('1ee178ba-2cb1-4275-b630-ae0a75dd513b');

// * Holding all of Soberana members IDs, useful for subscribing to events when ngrok resets
// soberanaIds = [146148785, 590931212, 539161835, 557225670, 40463426, 30865255, 694725890, 502441638, 127274602, 498425402, 49750261]
// soberanaIds.forEach((cur, ind, arr) => { subscribeToStreamOnline(cur) });

// * Delete list of events (useful when ngrok resets, since events are bound to callback url)
// let eventsToDelete = [
//     'b5a15f4b-88f1-4669-b040-c78a08b5c168',
//     '1608a9c2-ed01-407e-b692-76737fc69b95',
//     '9d3bac92-7a75-4e2e-83ae-a99e8d21e0f6',
//     '65657981-840c-441a-ae48-ec4293cad255',
//     'b85c9c8d-badc-4eb2-b158-c0b0c48d3b4a',
//     '1c52c66e-6ac3-4d49-83f8-6b1634ecab52',
//     '9e8d7ca7-6128-4c16-9509-134d615501bf',
//     'e1d02dfd-654b-4580-9a4b-0e82bc0b26da',
//     'f3d965f7-e209-41ba-ae65-e31b459717b0',
//     'fca5a976-da52-4d0f-b40e-d92245d4455c',
//     '477c99bf-4f9f-4f08-bef2-64237910059c'
// ];

// eventsToDelete.forEach(e => {
//     deleteSubscribedEvent(e);
// })

module.exports = {
	getChannelInfo,
	getSubscribedEvents,
	deleteSubscribedEvent,
	subscribeToStreamOnline,
};
