const bot = require('../engine')
const ViewChoosePrice = require('./choose-price')

const PATTERN_INPUT = /(\d+)\s?-\s?(\d+)$/
const VIEW_NAME = '__choose_audience'
const ACTION_RENDER = VIEW_NAME + '_action_render'

function render (payload, params) {
  const additionParams = {
    message_id: payload.message.message_id,
    chat_id: payload.from.id,
    parse_mode: 'Markdown'
  }

  bot.editMessageReplyMarkup({
    inline_keyboard: [[]],
  }, additionParams)
  bot.editMessageText(
    `Введите диапазон желаемой аудитории канала, в формате ⚠️ *от-до* ⚠️`,
    additionParams
  )
}

function init () {
  bot.on('callback_query', function (payload) {
    if (payload.data === ACTION_RENDER) {
      render(payload)

      return
    }
  })

  bot.onText(PATTERN_INPUT, (msg, match) => {
    // console.log('Matched ', match);

    ViewChoosePrice.render(msg)
  })
}

// function removeListeners () {
//   bot.removeTextListener(PATTERN_INPUT)
// }

exports.init = init
exports.render = render
exports.actions = {
  RENDER: ACTION_RENDER
}
// module.exports = {
//   init,
//   render,
//   foo: 'bar',
//   actions: function () {}
//   // PATTERN_INPUT
//   // removeListeners
// }
