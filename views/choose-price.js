const User = require('../dataAdapter/user')
const Order = require('../dataAdapter/order')
const MakeRequestFinish = require('./make-order-finish')
const AbstractView = require('./abstract')

const PATTERN_INPUT = /(\d+)\s?-\s?(\d+)\sRUB/

const i18 = {
  RUSSIAN: {
    keyboard: {
      any: 'Любая',
    },
    body: 'Введите желаему цену рекламы ⚠️ *от-до* ⚠️',
    invalid: 'Введенные данные не коректы',
  },
  ENGLISH: {
    keyboard: {
      any: 'Any',
    },
    body: 'Choose range of price with format ⚠️ *from-to* ⚠️',
    invalid: 'Input is invalid',
  },
}

class ViewChoosePrice extends AbstractView {
  get actions() {
    return {
      RENDER: this.wrapActionName('render'),
      ANY: this.wrapActionName('any'),
    }
  }

  constructor() {
    super()

    this.i18 = i18
    this.name = 'choose-price-view'

    this.onCallbackQuery(this.actions.RENDER, this.handleShow)
    this.onCallbackQuery(this.actions.ANY, this.handleAny)
    this.onMessagePattern(PATTERN_INPUT, this.handleInput)
  }

  handleShow(payload) {
    this._render(payload)
  }

  handleInput(payload, match) {
    if (match[1] > match[2]) {
      this.handleInvalidInput(payload)

      return
    }

    this.setPrice(payload, [match[1], match[2]])
  }

  handleAny(payload) {
    this.setPrice(payload)
  }

  async setPrice(message, values) {
    const user = await User.findUserByMessage(message)

    await Order.setPrice(user.orderDraft, values)
    MakeRequestFinish.instance._render.call(MakeRequestFinish.instance, message)
  }

  handleInvalidInput(message) {
    this.showError(message.from.id, this.getSubstrings('invalid'))
  }

  async _render(payload) {
    await this.updateLocale(payload)

    this.render(payload.from.id, this.getSubstrings('body'), {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: this.getSubstrings('keyboard.any'),
              callback_data: this.actions.ANY,
            },
          ],
        ],
      },
    })
  }
}

const instance = new ViewChoosePrice()

module.exports = {
  instance,
}
