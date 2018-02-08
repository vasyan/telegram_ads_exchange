const bot = require('../engine')
const ViewChoosePrice = require('./choose-price')
const User = require('../dataAdapter/user')
const Order = require('../dataAdapter/order')

const PATTERN_INPUT = /(\d+)\s?-\s?(\d+)$/
const VIEW_NAME = '__choose_audience'
const ACTIONS_PATTERN = VIEW_NAME + ':action:'
const CONSTANT_ANY = 'any'
const ACTION_CHOOSE_ANY = VIEW_NAME + ':action:' + CONSTANT_ANY
const ACTION_RENDER = VIEW_NAME + '_action_render'

const i18 = {
  RUSSIAN: {
    keyboard: {
      any: 'Любая',
    },
    body: 'Введите диапазон желаемой аудитории канала, в формате ⚠️ *от-до* ⚠️',
    invalid: 'Введенные данные не коректы'
  },
  ENGLISH: {
    keyboard: {
      any: 'Any',
    },
    body: 'Choose range of audience with format ⚠️ *from-to* ⚠️',
    invalid: 'Input is invalid'
  }
}

async function render (msg) {
  const locale = await User.getLocale(msg)
  const additionParams = {
    message_id: msg.message.message_id,
    chat_id: msg.from.id,
    parse_mode: 'Markdown'
  }

  bot.editMessageReplyMarkup({
    inline_keyboard: [[{
      text: i18[locale].keyboard.any,
      callback_data: ACTION_CHOOSE_ANY
    }]],
  }, additionParams)
  bot.editMessageText(
    i18[locale].body,
    additionParams
  )
}

async function setAudience (msg, values) {
  const user = await User.createOrderDraft(msg, { flush: false })

  await Order.setAudience(user.orderDraft, values)
  ViewChoosePrice.render(msg)
}

function handleActions ({ action, payload }) {
  switch (action) {
    case CONSTANT_ANY:
      setAudience(payload)
      break;
  }
}

async function handleInvalidInput (msg) {
  const locale = User.getLocale(msg)

  bot.sendMessage(msg.from.id, i18[locale].invalid)
}

function init () {
  bot.on('callback_query', function (payload) {
    if (payload.data === ACTION_RENDER) {
      render(payload)
      return
    }

    if (payload.data.indexOf(ACTIONS_PATTERN) !== -1) {
      const action = payload.data.match(/:action:(\w+)/)[1]

      handleActions({ action, payload })
    }
  })

  bot.onText(PATTERN_INPUT, (msg, match) => {
    if (match[1] > match[2]) {
      handleInvalidInput(msg)

      return
    }

    setAudience(msg, [match[1], match[2]])
  })
}

module.exports = {
  init,
  render,
  actions: {
    RENDER: ACTION_RENDER
  }
}
