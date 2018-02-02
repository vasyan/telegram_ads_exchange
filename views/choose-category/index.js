const bot = require('../../engine')
const Category = require('../../dataAdapter/category')
const User = require('../../dataAdapter/user')
const Order = require('../../dataAdapter/order')
const i18 = require('./i18')
const ViewGreeting = require('../greeting')
const ViewChooseAudience = require('../choose-audience')

const VIEW_NAME = '__choose_category'
const NEXT_PAGE = VIEW_NAME + '_next_page'
const PREV_PAGE = VIEW_NAME + '_prev_page'
const NEXT = VIEW_NAME + '_next'
// const SELL = '__greeting_sell'


function getSelectedIcon (value, selected = []) {
  if (selected.indexOf(value) > -1) {
    return ' ✅'
  }

  return ''
}

function renderInlineKeyboard ({
  list, selected, offset, locale
}) {
  const keys = list.slice(offset, 6).map((item) => {
    return {
      text: i18[locale].titles[item.title] + getSelectedIcon(item._id, selected),
      callback_data: `${VIEW_NAME}:select:${item._id}`
    }
  })

  const keyboard = []

  for (let i = 0; i < keys.length; i++){
    if ((i + 2) % 2 == 0) {
      keyboard.push([])
    }

    keyboard[keyboard.length - 1].push(keys[i])
  }

  return keyboard
}

function render (payload, params = { selected: [] }) {
  User._getLocale(payload).then((locale) => {
    User.createOrderDraft(payload, { flush: params.init }).then((user) => {
      Category.getAllCategories().then(list => {
        const categoriesKeys = renderInlineKeyboard({ list, selected: (user.orderDraft || []).categories, locale, offset: 0 })
        const additionParams = {
          message_id: payload.message.message_id,
          chat_id: payload.from.id
        }

        bot.editMessageReplyMarkup({
          inline_keyboard: [
            ...categoriesKeys,
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
              text: i18[locale].next,
              callback_data: ViewChooseAudience.actions.RENDER
            }],
          ],
        }, additionParams).catch((err) => console.error('catched on editMessageReplyMarkup'))

        bot.editMessageText(
          `Выберите подходящие категории канала`,
          additionParams
        ).catch((err) => void 0)
      })
    }).catch((err) => {
      console.log('choose category render error', err)
    })
  })
}

function init () {
  let selected = []
  let offset = 0

  bot.on('callback_query', function (payload) {
    if (payload.data.indexOf(`${VIEW_NAME}:select:`) === 0) {
      const selectedCategoryId = payload.data.match(/:select:(\w+)/)[1]

      User.findUser({ id: payload.from.id }).then((user) => {
        Order.findOrder({ _id: user.orderDraft }).then((order) => {
          if (order.categories.indexOf(selectedCategoryId) === -1) {
            order.categories.push(selectedCategoryId)
          } else {
            order.categories.remove(selectedCategoryId)
          }

          order.save().then(() => {
            render(payload, { offset, isBuying: true })
          }).catch(err => {
            console.log('error on order save ', err)
          })
        })
      })
    }

    switch (payload.data) {
      case ViewGreeting.actions.BUY:
        render(payload, { selected, offset, isBuying: true, init: true })
        break

      case ViewGreeting.actions.SELL:
        render(payload, { selected, offset, isSelling: true, init: true })
        break

      case PREV_PAGE:
        offset = offset - 6

        if (offset < 0) {
          offset = 0
        }
        render(payload, { selected, offset })
        break

      case NEXT_PAGE:
        offset = offset + 6
        render(payload, { selected, offset })
        break
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
