const AbstractView = require('./abstract')
const User = require('../data-adapter/user')
const ViewMyOrders = require('./my-orders')

const i18 = {
  RUSSIAN: {
    body: 'Заявка на размещение рекламы успешно создана.',
    showMyOrders: 'Мои заказы',
  },
  ENGLISH: {
    body: '👌 Well done. Your order has been approoved.',
    showMyOrders: 'My orders',
  },
}

class MakeRequestFinishView extends AbstractView {
  get actions() {
    return {
      RENDER: this.wrapActionName('render'),
    }
  }

  constructor() {
    super()

    this.i18 = i18
    this.name = 'buy-request-finish-view'

    this.onMessage(this.actions.RENDER, this.handleShow)
  }

  handleShow(payload) {
    this._render(payload)
  }

  async _render(message) {
    await this.updateLocale(message)

    try {
      await User.finishOrderDraft(message)
    } catch (error) {
      console.log('Catch on finished ', error)
    }

    this.render(message.from.id, this.getSubstrings('body'), {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: this.getSubstrings('showMyOrders'),
              callback_data: ViewMyOrders.instance.actions.RENDER,
            },
          ],
        ],
      },
    })
  }
}

module.exports = {
  instance: new MakeRequestFinishView(),
}
