const bot = require('../engine')
const ViewPostRequestFinish = require('./post-request-finish')

const PATTERN_INPUT = /(\d+)\s?-\s?(\d+)\sRUB/
const VIEW_NAME = '__choose_price'

function render (payload, params) {
  // console.log('payload', payload);
  // const additionParams = {
  //   message_id: payload.message.message_id,
  //   chat_id: payload.from.id,
  //   parse_mode: 'Markdown'
  // }

  bot.sendMessage(
    payload.from.id,
    'Введите желаемую цену в формате ⚠️ *от-до RUB* ⚠️',
    {
      parse_mode: 'Markdown'
    }
  )

  // bot.editMessageReplyMarkup({
  //   inline_keyboard: [
  //     [{
  //       text: 'Далее',
  //       callback_data: 'foobar'
  //     }],
  //   ],
  // }, additionParams).then(function (payload) {
  //   bot.editMessageText(`Введите диапазон желаемой аудитории канала, в формате *число-число*`, additionParams)
  // })
}

function init () {
  bot.onText(PATTERN_INPUT, (msg, match) => {
    ViewPostRequestFinish.render(msg)
  })
}

module.exports = {
  init,
  render
}
