const TelegramBot = require('node-telegram-bot-api');

const token = '480803172:AAEVQblEt06E-mZCPjWl6pptRsMzfcJzRb8';
const bot = new TelegramBot(token, {polling: true});

module.exports = bot
