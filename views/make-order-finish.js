const AbstractView = require('./abstract')
const User = require('../dataAdapter/user')

const i18 = {
	RUSSIAN: {
		body: 'Заявка на размещение рекламы успешно создана.',
		showMyOrders: 'Мои заявки',
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
			SHOW_MY_ORDERS: this.wrapActionName('show-my-orders'),
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

	async _render(msg) {
		await this.updateLocale(msg)

		User.finishOrderDraft(msg)

		this.render(msg.from.id, this.getSubstrings('body'), {
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: this.getSubstrings('showMyOrders'),
							callback_data: this.actions.SHOW_MY_ORDERS,
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
