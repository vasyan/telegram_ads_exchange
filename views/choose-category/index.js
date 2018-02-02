const bot = require('../../engine')
const Category = require('../../dataAdapter/category')
const User = require('../../dataAdapter/user')
const Order = require('../../dataAdapter/order')
const i18 = require('./i18')
const ViewGreeting = require('../greeting')
const ViewChooseAudience = require('../choose-audience')

const VIEW_NAME = '__choose_category'
const NEXT_PAGE = VIEW_NAME + ':page:next'
const PREV_PAGE = VIEW_NAME + ':page:prev'
const NEXT = VIEW_NAME + '_next'
// const SELL = '__greeting_sell'

const ITEMS_PER_PAGE = 6


function getSelectedIcon (value, selected = []) {
  if (selected.indexOf(value) > -1) {
    return ' ✅'
  }

  return ''
}

function renderInlineKeyboard ({
  list, selected, offset, locale
}) {
  console.log('renderInlineKeyboard', offset);
  const keys = list.slice(offset, offset + ITEMS_PER_PAGE).map((item) => {
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

function renderControls ({ offset, list }) {
  const isFirstPage = offset === 0
  const isLastPage = offset + ITEMS_PER_PAGE >= list.length

  const controls = []

  if (!isFirstPage) {
    controls.push(
      {
        text: '⬅️',
        callback_data: PREV_PAGE
      }
    )
  }
  if (!isLastPage) {
    controls.push(
      {
        text: '➡️',
        callback_data: NEXT_PAGE
      }
    )
  }

  return controls
}

function render (payload, { init, offset }) {
  User.getLocale(payload).then((locale) => {
    User.createOrderDraft(payload, { flush: init }).then((user) => {
      Category.getAllCategories().then(list => {
        const categoriesKeys = renderInlineKeyboard({ list, selected: (user.orderDraft || []).categories, locale, offset })
        const additionParams = {
          message_id: payload.message.message_id,
          chat_id: payload.from.id
        }

        bot.editMessageReplyMarkup({
          inline_keyboard: [
            ...categoriesKeys,
            renderControls({ offset: offset , list }),
            [{
              text: i18[locale].next,
              callback_data: ViewChooseAudience.actions.RENDER
            }],
          ],
        }, additionParams).catch((err) => console.error('catched on editMessageReplyMarkup'))

        bot.editMessageText(
          i18[locale].body,
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

      return
    }

    if (payload.data.indexOf(`${VIEW_NAME}:page:`) === 0) {
      const direction = payload.data.match(/:page:(\w+)/)[1]
      if (direction === 'prev') {
        offset = offset - ITEMS_PER_PAGE
      } else {
        offset = offset + ITEMS_PER_PAGE
      }

      if (offset < 0) {
        offset = 0
      }

      // console.log('offset', offset);

      render(payload, { offset, isBuying: true})

      return
    }

    switch (payload.data) {
      case ViewGreeting.actions.BUY:
        offset = 0
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
