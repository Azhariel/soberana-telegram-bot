const { sendMessage } = require('../api/telegram');
const { getEvents } = require('../api/googleCalendar');
const { getChannelInfo } = require('../api/twitch');

// * sample obj
// const livesToday = {
//     'Aniversário Marx': ['NaN:NaN', 'NaN:NaN'],
//     'História Pública - Comunews': ['12:00', '14:00'],
//     'Live - Gamer de Esquerda': ['16:00', '22:00'],
//     'Aula de Alemão - PonzuzuJu': ['17:00', '18:00']
// }

// Get current date
function getToday() {
    return today = new Date();
}

// Format date day/month/year as YYYY-MM-DD, useful for googleCalendar's getEvents function.
function formatDate(today) {
    return (`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
}

// ? Format time -> might refactor to be a part of formatSchedule
function formatTime(livesToday) {
    for (let live in livesToday) {
        let horarios = livesToday[live];
        let inicio = new Date(horarios[0]);
        let fim = new Date(horarios[1]);
        // padStart adds 0 at the beggining of the string if getHours/getMinutes returns a single digit
        horarios[0] = `${String(inicio.getHours()).padStart(2, '0')}:${String(inicio.getMinutes()).padStart(2, '0')}`;
        horarios[1] = `${String(fim.getHours()).padStart(2, '0')}:${String(fim.getMinutes()).padStart(2, '0')}`;
    }
    formatSchedule(livesToday);
}

/** 
* Given an object, format as table to display on messages
* Almost every special character must be escaped with two \\. Refer to Telegram API documentation.
* @param {object} schedule Object of events, each key is the event's name with an array as value containing [start time, end time] (as HH:MM).
*/
function formatSchedule(schedule) {
    let dia = getToday();
    dia = `${String(dia.getDate()).padStart(2, '0')}/${String(dia.getMonth() + 1).padStart(2, '0')}/${dia.getFullYear()}`;
    let formattedSchedule = `*Lives de Hoje \\(${dia}\\):*\n`;
    for (let event in schedule) {
        let horarios = schedule[event];
        let cleanEvent = characterEscaper(event);
        if (horarios[0] === 'NaN:NaN' || horarios[1] === 'NaN:NaN') {
            formattedSchedule += `\\[Data Especial\\]: ${cleanEvent}\n`
        } else {
            formattedSchedule += `\\[${horarios[0]}\\] \\- \\[${horarios[1]}\\]: ${cleanEvent}\n`;
        }
    }
    formattedSchedule += `\n_[Siga os canais aqui\\!](https://j\\.mp/twitchSoberana)_`
    console.log(`Sending schedule for ${dia}..`);
    console.log(`\n${formattedSchedule}`);
    sendMessage(formattedSchedule);
}

async function postTodaysEvents() {
    const today = getToday();
    const todayLives = await getEvents(formatDate(today));
    formatTime(todayLives);
}

function characterEscaper(text) {
    return text.replace(/(-)/g, '\\-')
        .replace(/(\.)/g, '\\.')
        .replace(/(!)/g, '\\!')
        .replace(/(\|)/g, '\\|')
        .replace(/(\()/g, '\\(')
        .replace(/(\))/g, '\\)')
        .replace(/(\*)/g, '\\*')
        .replace(/(\+)/g, '\\+')
        .replace(/(\[)/g, '\\[')
        .replace(/(\])/g, '\\]')
        .replace(/(_)/g, '\\_')
        .replace(/~/g, '\\~')
        .replace(/`/g, '\\`')
        .replace(/>/g, '\\>')
        .replace(/#/g, '\\#')
        .replace(/=/g, '\\=')
        .replace(/{/g, '\\{')
        .replace(/}/g, '\\}')
}

async function formatStreamOnline(stream) {
    let channelInfo = await getChannelInfo(stream.broadcaster_user_id);

    let gameName = characterEscaper(channelInfo.game_name);
    let channelTitle = characterEscaper(channelInfo.title);

    let formattedStreamOnline =
        `*${stream.broadcaster_user_name}* está online\\!\n*Jogando:* ${gameName}\n*Título:* ${channelTitle}\n\n_[Acompanhe ao vivo aqui\\!](https://twitch\\.tv/${stream.broadcaster_user_login})_`;

    sendMessage(formattedStreamOnline);
}

// postTodaysEvents();
module.exports = { formatTime, formatStreamOnline, postTodaysEvents };

