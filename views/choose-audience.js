const ViewChoosePrice = require('./choose-price')
const User = require('../dataAdapter/user')
const Order = require('../dataAdapter/order')
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

		this.onCallbackQuery([this.actions.RENDER], this.handleShow)
		this.onCallbackQuery([this.actions.ANY], this.handleAny)
		this.onMessagePattern([PATTERN_INPUT], this.handleInput)
	}

	handleShow(payload) {
		this._render(payload)
	}

	handleInput(msg, match) {
		if (match[1] > match[2]) {
			this.handleInvalidInput(msg)

			return
		}

		this.setAudience(msg, [match[1], match[2]])
	}

	handleAny(payload) {
		this.setAudience(payload)
	}

	async setAudience(msg, values) {
		const user = await User.createOrderDraft(msg, {})

		await Order.setAudience(user.orderDraft, values)
		ViewChoosePrice.render(msg)
	}

	handleInvalidInput(msg) {
		this.showError(msg.from.id, this.getSubstrings('invalid'))
	}

	async _render(payload) {
		await this.setLocale(payload)

		this.editRendered(payload, {
			markup: {
				inline_keyboard: [
					[
						{
							text: this.getSubstrings('keyboard').any,
							callback_data: this.actions.ANY,
						},
					],
				],
			},
			text: this.getSubstrings('body'),
		})
	}
}

const instance = new ChooseAuditoryView()

module.exports = {
	instance,
}
