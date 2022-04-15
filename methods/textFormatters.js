const { sendMessage } = require('./telegram');

// * sample obj
// const livesToday = {
//     'Live - Gamer de Esquerda': ['2022-04-14T16:00:00-03:00', '2022-04-14T22:00:00-03:00'],
//     'Aula de Alemão - PonzuzuJu': ['2022-04-14T17:00:00-03:00', '2022-04-14T18:00:00-03:00']
// }

// Get current date
function getToday() {
    return today = new Date();
}

// Format date day/month/year as YYYY-MM-DD, useful for googleCalendar's getEvents function.
function formatDate(today) {
    return (`${today.getFullYear()}-${String(today.getMonth()).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
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

// Given an object, format as table to display on messages
function formatSchedule(schedule) {
    let dia = getToday();
    dia = `${String(dia.getDate()).padStart(2, '0')}/${String(dia.getMonth()).padStart(2, '0')}/${dia.getFullYear()}`;
    let formattedSchedule = `** Lives de Hoje \\(${dia}\\): **\n`;
    for (let event in schedule) {
        let horarios = schedule[event];
        cleanEvent = event.replace('-', '\\-');
        formattedSchedule += `\\[${horarios[0]}\\] \\- \\[${horarios[1]}\\]: ${cleanEvent}\n`;
    }
    formattedSchedule += `\n__[Siga os canais aqui\\!](https://j\\.mp/twitchSoberana)__`
    console.log(formattedSchedule);
    sendMessage(formattedSchedule);
}

// formatTime(livesToday);