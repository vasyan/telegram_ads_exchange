const _ = require('lodash')
const bot = require('../engine')
const User = require('../dataAdapter/user')

const MENU_NAME = '@main_menu'
const SHOW = MENU_NAME + ''

const RUSSIAN = {
  welcome: 'Добро пожаловать',
  start: 'Начать',
  changeLocale: 'Сменить язык 🇷🇺',
  profile: 'Профиль ❌',
}

const ENGLISH = {
  welcome: 'Welcome',
  start: 'Start',
  changeLocale: 'Change locale 🇷🇺',
  profile: 'Profile ❌',
}

const COMMANDS = [
  ..._.values(ENGLISH),
  ..._.values(RUSSIAN)
]

const i18 = {
  RUSSIAN,
  ENGLISH
}

function render (msg) {
  User.getLocale(msg).then((locale) => {
    bot.sendMessage(msg.chat.id, i18[locale].welcome, {
      reply_markup: {
        keyboard: [
          [
            i18[locale].start,
            i18[locale].profile
          ],
          [i18[locale].changeLocale],
        ],
        resize_keyboard: true
      }
    })
  })
}

bot.onText(/\/start/, (msg) => {
  render(msg)
})

bot.on('message', (msg) => {
  if (COMMANDS.indexOf(msg.text) !== -1) {
    let command

    function iterator (value, key) {
      if (value === msg.text) {
        command = key
      }
    }

    _.forEach(RUSSIAN, iterator)
    _.forEach(ENGLISH, iterator)

    if (command === 'changeLocale') {
      User.findUser({ id: msg.from.id }).then((user) => {
        user.interfaceLanguage = Number(!user.interfaceLanguage)

        user.save().then(() => render(msg))
      })

      return
    }

    if (command === 'start') {
      console.log('startuy');
    }
  }
})

module.exports = {
  actions: {
    SHOW,
  },
  commands: {
    ENGLISH,
    RUSSIAN
  }
}
