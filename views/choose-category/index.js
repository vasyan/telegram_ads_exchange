const Category = require('../../dataAdapter/category')
const User = require('../../dataAdapter/user')
const Order = require('../../dataAdapter/order')
const i18 = require('./i18')
const ViewGreeting = require('../greeting')
const ViewChooseAudience = require('../choose-audience')
const AbstractView = require('../abstract')
const Paginator = require('../../ui/paginator')

const ITEMS_PER_PAGE = 6

class ChooseCategoryView extends AbstractView {
  get actions() {
    return {
      NEXT: this.wrapActionName('next'),
      SELECT: this.wrapActionName('select'),
    }
  }

  constructor() {
    super()

    this.i18 = i18
    this.name = 'choose-category-view'
    this.offset = 0

    this.handleSelect = this.handleSelect.bind(this)

    this.initItemView()
    this.initKeyboard()
    this.listenQueries()
  }

  initItemView() {
    this.itemView = {
      getId: item => {
        return item._id
      },
      getText: item => {
        return (
          this.getSubstrings('titles')[item.title] +
          this.getSelectedIcon(item._id)
        )
      },
    }
  }

  initKeyboard() {
    this.keyboard = {
      render: () => [
        {
          text: this.getSubstrings('next'),
          callback_data: ViewChooseAudience.instance.actions.RENDER,
        },
      ],
    }
  }

  updatePaginator(payload) {
    if (!this.paginator) {
      this.initPaginator(payload)
    }

    this.paginator._render()
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
      itemsPerPage: ITEMS_PER_PAGE,
    })
  }

  listenQueries() {
    this.onCallbackQuery(ViewGreeting.instance.actions.BUY, this.handleShow)
  }

  async handleShow(payload) {
    this.user = await User.createOrderDraft(payload, { flush: true })
    this._render(payload)
  }

  handleNextPage(payload) {
    this.offset = this.offset + ITEMS_PER_PAGE
    this._render(payload)
  }

  handlePrevPage(payload) {
    this.offset = this.offset - ITEMS_PER_PAGE

    if (this.offset < 0) {
      this.offset = 0
    }

    this._render(payload)
  }

  async handleSelect({ message, id }) {
    const user = await User.findUser({ id: message.from.id })
    const order = await Order.findOrder({ _id: user.orderDraft })

    if (order.categories.indexOf(id) === -1) {
      order.categories.push(id)
    } else {
      order.categories.remove(id)
    }

    await order.save()

    this._render(message)
  }

  async _render(message) {
    this.user = await User.createOrderDraft(message, {})
    await this.updateLocale(message)
    const list = await Category.getAllCategories()

    this.updatePaginator({
      message,
      list,
    })
  }
}

const instance = new ChooseCategoryView()

module.exports = {
  instance,
}
