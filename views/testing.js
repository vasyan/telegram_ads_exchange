const bot = require('../engine')
const ViewChoosePrice = require('./choose-price')
const ViewChooseAudience = require('./choose-audience')
const ViewChooseCategory = require('./choose-category')

const VIEW_PRICING = '__test_open_pricing'
const VIEW_AUDIENCE = '__test_open_audience'
const VIEW_CATEGORY = '__test_open_category'

function init () {
  bot.onText(/\/test$/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Тестовый режим', {
      reply_markup: {
        keyboard: [
          ['/whoami'],
          ['На главную']
        ],
        resize_keyboard: true
      }
    })

    bot.sendMessage(msg.chat.id, 'Доступные действия коллбеков', {
      reply_markup: {
        inline_keyboard: [
          [{
            text: 'Страница ввода цены',
            callback_data: VIEW_PRICING
          }],
          [{
            text: 'Страница ввода аудитории',
            callback_data: VIEW_AUDIENCE
          }],
          [{
            text: 'Страница выбора категорий',
            callback_data: VIEW_CATEGORY
          }],
        ],
      }
    })
  })

  bot.on('callback_query', (payload) => {
    switch (payload.data) {
      case VIEW_PRICING:
        ViewChoosePrice.render(payload)
        break;
      case VIEW_AUDIENCE:
        ViewChooseAudience.render(payload)
        break;
      case VIEW_CATEGORY:
        ViewChooseCategory.render(payload)
        break;
    }
  })
}

module.exports = {
  init
}
