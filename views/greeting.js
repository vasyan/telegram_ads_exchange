const bot = require('../engine')
const User = require('../dataAdapter/user')
const mainMenu = require('../menus/main')
const AbstractView = require('./abstract')

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

class GreetingView extends AbstractView {
  constructor () {
    super()

    this.name = 'greeting-view'

    this.onMessage(SHOW_COMMANDS, this.handleShow)
  }

  async handleShow (msg) {
    const { user } = await User.addUser(msg.from)
    const dictionary = i18[User.getLocaleFromUser(user)]

    this.render(
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
    )
  }
}

const instance = new GreetingView()

module.exports = {
  instance,
  actions: {
    BUY,
    SELL
  },
  constants: {
    RUSSIAN,
    ENGLISH
  }
}
