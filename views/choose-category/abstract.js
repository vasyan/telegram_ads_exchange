const Category = require('../../data-adapter/category')
const i18 = require('./i18')
const AbstractView = require('../abstract')
const Paginator = require('../../ui/paginator')

const ITEMS_PER_PAGE = 6

class AbstractChooseCategoryView extends AbstractView {
  get actions() {
    return {
      NEXT: this.wrapActionName('next'),
      SELECT: this.wrapActionName('select'),
    }
  }

  constructor(options) {
    super(...arguments)

    this.i18 = i18
    this.name = options.name
    this.offset = 0

    this.handleSelect = this.handleSelect.bind(this)

    this.initItemView()
    this.initKeyboard()
    this.listenQueries()
  }

  getItemViewText(item) {
    return 'item text'
  }

  initItemView() {
    this.itemView = {
      getId: item => {
        return item._id
      },
      getText: item => {
        return this.getItemViewText(item)
      },
    }
  }

  getNextCallbackData() {
    console.log('abstract getNextCallbackData')

    return 'abstract::next'
  }

  initKeyboard() {
    this.keyboard = {
      render: () => [
        {
          text: this.getSubstrings('next'),
          callback_data: this.getNextCallbackData(),
        },
      ],
    }
  }

  updatePaginator(payload) {
    if (!this.paginator) {
      this.initPaginator(payload)
    }

    this.paginator._render({ message: payload.message })
  }

  getBodyText() {
    return 'abstract body text'
  }

  initPaginator({ message, list }) {
    this.paginator = new Paginator({
      message,
      list,
      body: this.getBodyText(),
      itemView: this.itemView,
      keyboard: this.keyboard,
      onSelect: this.handleSelect,
      menu: this.menu,
      itemsPerPage: ITEMS_PER_PAGE,
    })
  }

  getRenderTriggers() {
    console.log('abstract getRenderTriggers')
  }

  listenQueries() {
    this.onCallbackQuery(this.getRenderTriggers(), this.handleShow)
  }

  handleShow(payload) {
    this._render(payload)
  }

  async handleSelect({ message, id }) {
    console.log('abstract handleSelect')
  }

  updateUser(message) {
    console.log('abstract update user')
  }

  async _render(message) {
    this.updateUser(message)

    await this.updateLocale(message)
    const list = await Category.getAllCategories()

    this.updatePaginator({
      message,
      list,
    })
  }
}

module.exports = AbstractChooseCategoryView
