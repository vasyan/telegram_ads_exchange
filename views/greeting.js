const bot = require('../engine')
const User = require('../dataAdapter/user')
const mainMenu = require('../menus/main')

const BUY = '__greeting_buy'
const SELL = '__greeting_sell'
const RUSSIAN = {
  welcome: 'Добро пожаловать.',
  greetingBrif: 'Этот бот поможет вам найти подходящую площадку для вашей рекламы, либо рекламу для вашей площадки. Тиндер для рекламы.',
  inlineMenu: {
    buy: 'Купить',
    sell: 'Продать'
  }
}
const ENGLISH = {
  welcome: 'Welcome',
  greetingBrif: 'This bot will help you find a suitable platform for your advertising, or advertising for your site. Tinder for advertising.',
  inlineMenu: {
    buy: 'Buy',
    sell: 'Sell'
  }
}
const i18 = {
  ENGLISH,
  RUSSIAN
}

const SHOW_COMMANDS = [
  mainMenu.commands.ENGLISH.start,
  mainMenu.commands.RUSSIAN.start
]

function init () {
  bot.on('message', function (msg) {
    if (SHOW_COMMANDS.indexOf(msg.text) !== -1) {
      User.addUser(msg.from).then(({ user }) => {
        const dictionary = i18[User.extractLocaleFromUser(user)]

        bot.sendMessage(
          msg.chat.id,
          `${dictionary.welcome}, ${user.username}! ` +
          dictionary.greetingBrif,
          {
            reply_markup: {
              inline_keyboard: [
                [{
                  text: dictionary.inlineMenu.buy,
                  callback_data: BUY
                }],
                [{
                  text: dictionary.inlineMenu.sell,
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
  })
}

module.exports = {
  init,
  actions: {
    BUY,
    SELL
  },
  constants: {
    RUSSIAN,
    ENGLISH
  }
}
