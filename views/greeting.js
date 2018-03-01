const User = require('../data-adapter/user')
const mainMenu = require('../menus/main')
const AbstractView = require('./abstract')

const BUY = 'buy'
const SELL = 'sell'
const RUSSIAN = {
  welcome: 'Добро пожаловать.',
  greetingBrif:
    'Этот бот поможет вам найти подходящую площадку для вашей рекламы, либо рекламу для вашей площадки. Тиндер для рекламы.',
  inlineMenu: {
    buy: 'Купить',
    sell: 'Продать',
  },
}
const ENGLISH = {
  welcome: 'Welcome',
  greetingBrif:
    'This bot will help you find a suitable platform for your advertising, or advertising for your site. Tinder for advertising.',
  inlineMenu: {
    buy: 'Buy',
    sell: 'Sell',
  },
}
const i18 = {
  ENGLISH,
  RUSSIAN,
}

class GreetingView extends AbstractView {
  get actions() {
    return {
      BUY: this.wrapActionName(BUY),
      SELL: this.wrapActionName(SELL),
    }
  }

  constructor() {
    super()

    this.i18 = i18
    this.name = 'greeting-view'

    this.onMessage(
      [mainMenu.commands.ENGLISH.start, mainMenu.commands.RUSSIAN.start],
      this.handleShow
    )
  }

  async handleShow(msg) {
    const { user } = await User.addUser(msg.from)
    const dictionary = i18[User.getLocaleFromUser(user)]

    await this.updateLocale(msg)

    this.render(
      msg.chat.id,
      `${dictionary.welcome}, ${user.username}! ` + dictionary.greetingBrif,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: this.getSubstrings('inlineMenu.buy'),
                callback_data: this.actions.BUY,
              },
            ],
            [
              {
                text: this.getSubstrings('inlineMenu.sell'),
                callback_data: this.actions.SELL,
              },
            ],
          ],
        },
      }
    )
  }
}

const instance = new GreetingView()

module.exports = {
  instance,
  constants: {
    RUSSIAN,
    ENGLISH,
  },
}
