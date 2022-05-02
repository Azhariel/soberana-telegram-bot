require('dotenv').config();
const { google } = require('googleapis');
// const { formatTime } = require('../methods/textFormatters');
// const { sendMessage } = require('../methods/telegram');

const { GOOGLE_REDIRECT_URL,
    GOOGLE_CALENDAR_CLIENT_ID,
    GOOGLE_CALENDAR_CLIENT_KEY,
    GOOGLE_CALENDAR_SCOPE,
    GOOGLE_CALENDAR_ID,
    GOOGLE_CALENDAR_CODE,
    GOOGLE_CALENDAR_ACCESS_TOKEN,
    GOOGLE_CALENDAR_REFRESH_TOKEN
} = process.env;

const calendar = google.calendar('v3');

const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CALENDAR_CLIENT_ID,
    GOOGLE_CALENDAR_CLIENT_KEY,
    GOOGLE_REDIRECT_URL,
    GOOGLE_CALENDAR_SCOPE
);

// ! Hard coding token creds --> this must be passed dynamically to handle token expires
const token = {
    access_token: GOOGLE_CALENDAR_ACCESS_TOKEN,
    refresh_token: GOOGLE_CALENDAR_REFRESH_TOKEN,
    scope: GOOGLE_CALENDAR_SCOPE,
    token_type: 'Bearer',
    expiry_date: 1649893433922
}

oauth2Client.setCredentials(token)

google.options({
    auth: oauth2Client
});

/* 
* Generate a url that asks permissions for Google Calendar scope
* A code is generated after authorization flow by the user, and is returned as url query "code".
! This code may need to be decoded using decodeURIComponent('code');
*/
const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',

    // If you only need one scope you can pass it as a string
    scope: GOOGLE_CALENDAR_SCOPE
});

// console.log(url);

// Gets access and refresh token from a given code (get code via URL above)
// ! With the code, you get a token - but the code is used up and cannot be used to generate other tokens.
async function getToken() {
    const { tokens } = await oauth2Client.getToken(GOOGLE_CALENDAR_CODE);
    console.log(tokens);
    oauth2Client.setCredentials(tokens);
}

/**
* Gets refreshed token, sets as credentials.
*/
async function getRefreshedToken() {
    try {
        const refreshedToken = await oauth2Client.getAccessToken();
        oauth2Client.setCredentials(refreshedToken.res.data);
        console.log(`Refresh token status: ${refreshedToken.res.status} ${refreshedToken.res.statusText}`);
    } catch (error) {
        console.log(error);
    }
}

/**
* Gets the events, given a date.
* Date must be formatted as: YYYY-MM-DD.
*/
async function getEvents(date) {
    await getRefreshedToken();
    const res = await calendar.events.list({
        calendarId: GOOGLE_CALENDAR_ID,
        singleEvents: true,
        orderBy: 'startTime',
        timeMax: `${date}T23:59:00-03:00`,
        timeMin: `${date}T00:00:01-03:00`
    });
    let livesToday = {};
    for (let lives of res.data.items) {
        livesToday[lives.summary] = [lives.start.dateTime, lives.end.dateTime];
    }
    // console.log(livesToday);
    return (livesToday);
}
// getEvents('2022-04-14');

module.exports = { getEvents };