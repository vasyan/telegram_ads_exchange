const bot = require('../engine')
const ViewGreeting = require('./greeting')
const ViewChooseAudience = require('./choose-audience')
const ViewChoosePrice = require('./choose-price')

const VIEW_NAME = '__choose_category'
const NEXT_PAGE = VIEW_NAME + '_next_page'
const PREV_PAGE = VIEW_NAME + '_prev_page'
const NEXT = VIEW_NAME + '_next'
// const SELL = '__greeting_sell'

function getSelectedIcon (value, selected) {
  if (selected.indexOf(value) > -1) {
    return ' ✅'
  }

  return ''
}

function render (payload, params = { selected: []}) {
  const additionParams = {
    message_id: payload.message.message_id,
    chat_id: payload.from.id
  }

  bot.editMessageReplyMarkup({
    inline_keyboard: [
      [
        {
          text: 'все' + getSelectedIcon(0, params.selected),
          callback_data: '__all'
        },
        {
          text: 'блог' + getSelectedIcon(1, params.selected),
          callback_data: '__blog'
        },
        {
          text: 'юмор' + getSelectedIcon(2, params.selected),
          callback_data: '__humor'
        },
        {
          text: 'крипта' + getSelectedIcon(3, params.selected),
          callback_data: '__crypto'
        }
      ].slice(params.offset, params.offset + 2),
      [
        {
          text: '⬅️',
          callback_data: PREV_PAGE
        },
        {
          text: '➡️',
          callback_data: NEXT_PAGE
        }
      ],
      [{
        text: 'Далее',
        callback_data: ViewChooseAudience.actions.RENDER
      }],
    ],
  }, additionParams).catch((err) => console.error('catched on editMessageReplyMarkup'))

  bot.editMessageText(
    `Выберите подходящие категории канала`,
    additionParams
  ).catch((err) => console.error('catched on editMessageText'))
}

function init () {
  let selected = []
  let offset = 0

  function selectedToggle (value) {
    if (selected.indexOf(value) === -1) {
      selected.push(value)
    } else {
      selected = selected.filter((item) => item !== value)
    }
  }

  bot.on('callback_query', function (payload) {
    switch (payload.data) {
      case ViewGreeting.actions.BUY:
        render(payload, { selected, offset })
        break;

      case PREV_PAGE:
        offset = 0
        render(payload, { selected, offset })
        break;

      case NEXT_PAGE:
        offset = 2
        render(payload, { selected, offset })
        break;

      case '__all':
        selectedToggle(0)
        render(payload, { selected, offset })
        break;

      case '__blog':
        selectedToggle(1)
        render(payload, { selected, offset })
        break;

      case '__humor':
        selectedToggle(2)
        render(payload, { selected, offset })
        break;

      case '__crypto':
        selectedToggle(3)
        render(payload, { selected, offset })
        break;
    }
  })
}

module.exports = {
  init,
  render,
  actions: {
    NEXT
  }
}
