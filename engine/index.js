const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })

const originalEditMessageText = bot.editMessageText

bot.editMessageText = function(...args) {
  const message = args[0]
  const { text, markup, params = {} } = args[1]
  const data = Object.assign(params, {
    message_id: message.message_id || message.message.message_id,
    chat_id: message.from.id,
    reply_markup: markup,
  })

  originalEditMessageText.apply(bot, [text, data])
}

module.exports = bot
