const Category = require('../../dataAdapter/category')
const User = require('../../dataAdapter/user')
const Order = require('../../dataAdapter/order')
const i18 = require('./i18')
const ViewGreeting = require('../greeting')
const ViewChooseAudience = require('../choose-audience')
const AbstractView = require('../abstract')

const ITEMS_PER_PAGE = 6

class ChooseCategoryView extends AbstractView {
	get actions() {
		return {
			NEXT: this.wrapActionName('next'),
			NEXT_PAGE: this.wrapActionName('next-page'),
			PREV_PAGE: this.wrapActionName('prev-page'),
			SELECT: this.wrapActionName('select'),
		}
	}

	constructor() {
		super()

		this.i18 = i18
		this.name = 'choose-category-view'
		this.offset = 0

		this.listenQueries()
	}

	listenQueries() {
		this.onCallbackQuery([ViewGreeting.instance.actions.BUY], this.handleShow)
		this.onCallbackQuery([this.actions.NEXT_PAGE], this.handleNextPage)
		this.onCallbackQuery([this.actions.PREV_PAGE], this.handlePrevPage)
		this.onCallbackQuery([this.actions.SELECT], this.handleSelect)
	}

	async handleShow(payload) {
		this.user = await User.createOrderDraft(payload, { flush: true })
		this._render(payload, { isBuying: true })
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

	async handleSelect(payload) {
		const selectedCategoryId = payload.data.match(/@(\w+)/)[1]
		const user = await User.findUser({ id: payload.from.id })
		const order = await Order.findOrder({ _id: user.orderDraft })

		if (order.categories.indexOf(selectedCategoryId) === -1) {
			order.categories.push(selectedCategoryId)
		} else {
			order.categories.remove(selectedCategoryId)
		}

		await order.save()

		this._render(payload, { isBuying: true })
	}

	async _render(payload) {
		this.user = await User.createOrderDraft(payload, {})
		await this.setLocale(payload)

		this.editRendered(payload, {
			markup: await this.renderMarkup(payload),
			text: this.getSubstrings('body'),
		})
	}

	async renderMarkup() {
		const list = await Category.getAllCategories()

		const categoriesRows = this.renderCategoriesRows({ list })

		return {
			inline_keyboard: [
				...categoriesRows,
				this.renderControls({ list }),
				[
					{
						text: this.getSubstrings('next'),
						callback_data: ViewChooseAudience.instance.actions.RENDER,
					},
				],
			],
		}
	}

	renderControls({ list }) {
		const isFirstPage = this.offset === 0
		const isLastPage = this.offset + ITEMS_PER_PAGE >= list.length

		const controls = [
			{
				text: '⬅️',
				callback_data: isFirstPage ? '_BLANK_' : this.actions.PREV_PAGE,
			},
			{
				text: `${this.offset / ITEMS_PER_PAGE}/${Math.floor(
					list.length / ITEMS_PER_PAGE
				)}`,
				callback_data: '_BLANK_',
			},
			{
				text: '➡️',
				callback_data: isLastPage ? '_BLANK_' : this.actions.NEXT_PAGE,
			},
		]

		return controls
	}

	renderCategoriesRows({ list }) {
		const { offset } = this

		const keys = list.slice(offset, offset + ITEMS_PER_PAGE).map(item => {
			return {
				text:
					this.getSubstrings('titles')[item.title] +
					this.getSelectedIcon(item._id),
				callback_data: `${this.actions.SELECT}@${item._id}`,
			}
		})

		const keyboard = []

		for (let i = 0; i < keys.length; i++) {
			if ((i + 2) % 2 == 0) {
				keyboard.push([])
			}

			keyboard[keyboard.length - 1].push(keys[i])
		}

		return keyboard
	}

	getSelectedIcon(value) {
		const selected = (this.user.orderDraft || []).categories

		if (selected.indexOf(value) > -1) {
			return ' ✅'
		}

		return ''
	}
}

const instance = new ChooseCategoryView()

module.exports = {
	instance,
}
