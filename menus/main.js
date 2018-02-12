const R = require('ramda')
const bot = require('../engine')
const User = require('../dataAdapter/user')

const MENU_NAME = '@main_menu'
const SHOW = MENU_NAME + ''

const RUSSIAN = {
  welcome: 'Добро пожаловать',
  start: 'Начать',
  myOrders: 'Мои заказы',
  changeLocale: 'Сменить язык 🇷🇺',
  profile: 'Профиль ❌',
}

const ENGLISH = {
  welcome: 'Welcome',
  start: 'Start',
  myOrders: 'My orders',
  changeLocale: 'Change locale 🇷🇺',
  profile: 'Profile ❌',
}

const COMMANDS = [...R.values(ENGLISH), ...R.values(RUSSIAN)]

const i18 = {
  RUSSIAN,
  ENGLISH,
}

async function render(msg) {
  const locale = await User.getLocale(msg)

  bot.sendMessage(msg.chat.id, i18[locale].welcome, {
    reply_markup: {
      keyboard: [
        [i18[locale].start, i18[locale].profile],
        [i18[locale].myOrders, i18[locale].changeLocale],
      ],
      resize_keyboard: true,
    },
  })
}

bot.onText(/\/start/, msg => {
  render(msg)
})

bot.on('message', msg => {
  if (COMMANDS.indexOf(msg.text) !== -1) {
    let command

    function iterator(value, key) {
      if (value === msg.text) {
        command = key
      }
    }

    R.forEachObjIndexed(iterator, RUSSIAN)
    R.forEachObjIndexed(iterator, ENGLISH)

    if (command === 'changeLocale') {
      User.findUser({id: msg.from.id}).then(user => {
        user.interfaceLanguage = Number(!user.interfaceLanguage)

        user.save().then(() => render(msg))
      })

      return
    }

    if (command === 'start') {
      console.log('startuy')
      render(msg)
    }
  }
})

module.exports = {
  actions: {
    SHOW,
  },
  commands: {
    ENGLISH,
    RUSSIAN,
  },
}
