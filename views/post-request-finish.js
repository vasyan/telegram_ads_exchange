const bot = require('../engine')

const VIEW_NAME = '__post-request-finish'

function render (payload, params) {
  console.log('Post request finish render with payload', payload);

  bot.sendMessage(
    payload.from.id,
    '👌 Заявка на размещение рекламы успешно создана',
    {
      parse_mode: 'Markdown'
    }
  )
}

function init () { }

module.exports = {
  init,
  render
}
