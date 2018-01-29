const bot = require('../engine')
const BUY = '__greeting_buy'
const SELL = '__greeting_sell'

function init () {
  bot.onText(/\/start/, function (msg) {
    bot.sendMessage(
      msg.chat.id,
      `Добро пожаловать. Этот бот поможет вам найти подходящую площадку для вашей рекламы, либо рекламу для вашей площадки. Тиндер для рекламы.`,
      {
        reply_markup: {
          // keyboard: [['Купить'], ['Пpодать']],
          // resize_keyboard: true
          inline_keyboard: [
            [{
              text: 'Купить место',
              callback_data: BUY
            }],
            [{
              text: 'Продать место',
              callback_data: SELL
            }]
          ],
        }
      }
    ).catch(function (err) {
      console.log('Greeting view sending error', err);
    })
  })
}

module.exports = {
  init,
  actions: {
    BUY,
    SELL
  }
}
