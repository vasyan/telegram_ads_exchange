const ViewChoosePrice = require('./choose-price')
const User = require('../data-adapter/user')
const Order = require('../data-adapter/order')
const AbstractView = require('./abstract')

const PATTERN_INPUT = /(\d+)\s?-\s?(\d+)$/

const i18 = {
  RUSSIAN: {
    keyboard: {
      any: 'Любая',
    },
    body: 'Введите диапазон желаемой аудитории канала, в формате ⚠️ *от-до* ⚠️',
    invalid: 'Введенные данные не коректы',
  },
  ENGLISH: {
    keyboard: {
      any: 'Any',
    },
    body: 'Choose range of audience with format ⚠️ *from-to* ⚠️',
    invalid: 'Input is invalid',
  },
}

class ChooseAuditoryView extends AbstractView {
  get actions() {
    return {
      RENDER: this.wrapActionName('render'),
      ANY: this.wrapActionName('any'),
    }
  }

  constructor() {
    super()

    this.i18 = i18
    this.name = 'choose-auditory-view'

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

    this.setAudience(payload, [match[1], match[2]])
  }

  handleAny(payload) {
    this.setAudience(payload)
  }

  async setAudience(message, values) {
    const { order } = await User.getOrderDraft(message)

    await Order.setAudience(order._id, values)

    ViewChoosePrice.instance._render.call(ViewChoosePrice.instance, message)
  }

  handleInvalidInput(message) {
    this.showError(message.from.id, this.getSubstrings('invalid'))
  }

  async _render(payload) {
    await this.updateLocale(payload)

    this.editRendered(payload, {
      markup: {
        inline_keyboard: [
          [
            {
              text: this.getSubstrings('keyboard.any'),
              callback_data: this.actions.ANY,
            },
          ],
        ],
      },
      text: this.getSubstrings('body'),
      params: {
        parse_mode: 'Markdown',
      },
    })
  }
}

module.exports = {
  instance: new ChooseAuditoryView(),
}
