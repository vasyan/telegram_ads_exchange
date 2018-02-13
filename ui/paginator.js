const AbstractUiView = require('./abstract')

class Paginator extends AbstractUiView {
  get actions() {
    return {
      SELECT: this.wrapActionName('select'),
      NEXT_PAGE: this.wrapActionName('next-page'),
      PREV_PAGE: this.wrapActionName('prev-page'),
    }
  }

  get isFirstPage() {
    return this.offset === 0
  }

  get isLastPage() {
    return this.offset + this.itemsPerPage >= this.list.length
  }

  get progress() {
    return `${this.offset / this.itemsPerPage}/${Math.floor(
      this.list.length / this.itemsPerPage
    )}`
  }

  get isOverfilled() {
    return this.list.length > this.itemsPerPage
  }

  constructor({
    body,
    list,
    itemsPerPage,
    onSelect,
    itemView,
    keyboard,
    columns,
  }) {
    super(...arguments)

    this.name = 'paginator-id-' + Math.floor(Math.random() * 999999 + 1)
    this.body = body
    this.list = list
    this.itemView = itemView
    this.onSelect = onSelect
    this.keyboard = keyboard || []
    this.itemsPerPage = itemsPerPage
    this.offset = 0
    this.columns = columns || 2

    this.listenEvents()
  }

  listenEvents() {
    this.onCallbackQuery(this.actions.SELECT, this.handleSelect)
    this.onCallbackQuery(this.actions.NEXT_PAGE, this.handleNextPage)
    this.onCallbackQuery(this.actions.PREV_PAGE, this.handlePrevPage)
  }

  next() {
    this.offset = this.offset + this.itemsPerPage

    this._render()
  }

  prev() {
    this.offset = this.offset - this.itemsPerPage

    if (this.offset < 0) {
      this.offset = 0
    }

    this._render()
  }

  renderRows() {
    const { offset } = this

    const items = this.list
      .slice(offset, offset + this.itemsPerPage)
      .map(item => {
        return {
          text: this.getItemView(item),
          callback_data: `${this.actions.SELECT}@${this.itemView.getId(item)}`,
        }
      })

    const rows = []

    for (let i = 0; i < items.length; i++) {
      if ((i + this.columns) % this.columns == 0) {
        rows.push([])
      }

      rows[rows.length - 1].push(items[i])
    }

    return rows
  }

  renderControls() {
    if (!this.isOverfilled) {
      return []
    }

    const controls = [
      {
        text: '⬅️',
        callback_data: this.isFirstPage ? '_BLANK_' : this.actions.PREV_PAGE,
      },
      {
        text: this.progress,
        callback_data: '_BLANK_',
      },
      {
        text: '➡️',
        callback_data: this.isLastPage ? '_BLANK_' : this.actions.NEXT_PAGE,
      },
    ]

    return controls
  }

  renderAdditionUi() {
    if (this.keyboard) {
      return this.keyboard.render()
    }

    return []
  }

  getItemView(item) {
    return this.itemView.getText(item)
  }

  handleSelect(message) {
    const id = message.data.match(/@(\w+)/)[1]

    this.onSelect({ id, message })
  }

  handleNextPage() {
    this.next()
  }

  handlePrevPage() {
    this.prev()
  }

  async _render() {
    const markup = {
      inline_keyboard: [
        ...this.renderRows(),
        this.renderControls(),
        this.renderAdditionUi(),
      ],
    }

    if (!this.isEditableMessage(this.message)) {
      this.render(this.message.chat.id, this.body, {
        reply_markup: markup,
      })

      return
    }

    this.editRendered(this.message, {
      markup,
      text: this.body,
    })
  }
}

module.exports = Paginator
