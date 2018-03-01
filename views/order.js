const Order = require('../data-adapter/order')
const AbstractView = require('./abstract')

const RUSSIAN = {
  body: 'Заказ номер №',
  audience: 'Аудитория',
  price: 'Цена',
  categories: 'Категории',
  back: '⬅️ Назад',
}
const ENGLISH = {
  body: 'Order numer №',
  audience: 'Audience',
  price: 'Price',
  categories: 'Category',
  back: '⬅️ Back',
}
const i18 = {
  ENGLISH,
  RUSSIAN,
}

class OrderView extends AbstractView {
  get actions() {
    return {
      RENDER: this.wrapActionName('render'),
      BACK: this.wrapActionName('back'),
    }
  }

  constructor() {
    super()

    this.i18 = i18
    this.name = 'order-view'

    this._render = this._render.bind(this)

    this.onCallbackQuery(this.actions.RENDER, this.handleShow)
    this.onCallbackQuery(this.actions.BACK, this.handleBack)
  }

  handleShow(payload) {
    this._render(payload)
  }

  handleBack() {}

  async _render({ message, id }) {
    const order = await Order.findOrderById(id)
    await this.updateLocale(message)

    this.editRendered(message, {
      markup: {
        inline_keyboard: [
          [
            {
              text: this.getSubstrings('back'),
              // callback_data: MyOrders.instance.actions.RENDER,
              callback_data: '__BLANK',
            },
          ],
        ],
      },
      text: `✅
        ${this.getSubstrings('body')}: ${order.number}
        ${this.getSubstrings('price')}: ${order.priceLow}-${order.priceHigh}
        ${this.getSubstrings('audience')}: ${order.audienceLow}-${
        order.audienceHigh
      }
      `,
    })
  }
}

module.exports = {
  instance: new OrderView(),
}
