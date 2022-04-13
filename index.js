require('dotenv').config();
const { Telegraf } = require('telegraf');
const apiToken = process.env.API_TOKEN;

const bot = new Telegraf(apiToken);


bot.start((content) => content.reply('Comunismo vencerá!'));

bot.launch();
console.log('🤖 rodando');