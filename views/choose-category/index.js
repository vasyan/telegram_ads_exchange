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

  getSelectedIcon(value) {
    let selected = []

    if (this.order) {
      selected = this.order.categories
    }

    if (selected.indexOf(value) > -1) {
      return ' ✅'
    }

    return ''
  }

  updatePaginator(payload) {
    if (!this.paginator) {
      this.initPaginator(payload)
    }

    this.paginator._render({ message: payload.message })
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
    const { user, order } = await User.createOrderDraft(payload, {
      flush: true,
    })

    this.user = user
    this.order = order

    this._render(payload)
  }

  async handleSelect({ message, id }) {
    const { order } = this

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
