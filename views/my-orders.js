const User = require('../dataAdapter/user')
const mainMenu = require('../menus/main')
const OrderView = require('./order')
const AbstractView = require('./abstract')
const Paginator = require('../ui/paginator')

const RUSSIAN = {
  body: 'Список активных заявок на размещение рекламы.',
  itemTitle: 'Заказ на размещение ♨️',
  noOrders: 'У вас нет активных заказов.',
  back: '⬅️ Назад',
}
const ENGLISH = {
  body: 'List of active orders of ad.',
  itemTitle: 'Заказ на размещение ♨️',
  noOrders: 'You dont have active orders.',
  back: '⬅️ Back',
}
const i18 = {
  ENGLISH,
  RUSSIAN,
}

const ITEMS_PER_PAGE = 6

class MyOrdersView extends AbstractView {
  get actions() {
    return {
      RENDER: this.wrapActionName('render'),
    }
  }

  constructor() {
    super()

    this.i18 = i18
    this.name = 'my-orders-view'

    this.onCallbackQuery(this.actions.RENDER, this.handleShow)
    this.onMessage(
      [
        this.actions.RENDER,
        mainMenu.commands.ENGLISH.myOrders,
        mainMenu.commands.RUSSIAN.myOrders,
      ],
      this.handleShow
    )

    this.initItemView()
    this.initKeyboard()
  }

  initPaginator({ message, list }) {
    this.paginator = new Paginator({
      message,
      list,
      body: this.getSubstrings('body'),
      itemView: this.itemView,
      keyboard: this.keyboard,
      onSelect: this.handleSelect,
      menu: this.menu,
      columns: 1,
      itemsPerPage: ITEMS_PER_PAGE,
    })
  }

  initItemView() {
    this.itemView = {
      getId: item => {
        return item._id
      },
      getText: () => this.getSubstrings('itemTitle'),
    }
  }

  initKeyboard() {
    this.keyboard = {
      render: () => [],
    }
  }

  updatePaginator(payload) {
    if (!this.paginator) {
      this.initPaginator(payload)
    }

    this.paginator._render()
  }

  handleShow(payload) {
    this._render(payload)
  }

  handleSelect(payload) {
    OrderView.instance._render(payload)
  }

  async _render(message) {
    const user = await User.findUserByMessage(message)
    await this.updateLocale(message)

    if (user.orders.length === 0) {
      this.render(message.from.id, this.getSubstrings('noOrders'))
      return
    }

    this.updatePaginator({
      message,
      list: user.orders,
    })
  }
}

module.exports = {
  instance: new MyOrdersView(),
}
