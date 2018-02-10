const bot = require('../engine')
const User = require('../dataAdapter/user')

const PATTERN_ARGS = /@.+/

class AbstractView {
	get actionsPattern() {
		if (!this.name) {
			throw new Error('😅 You must define view name at the constructor 😅')
		}

		return this.name + `:action:`
	}

	async setLocale(msg) {
		if (this.lastUserId !== msg.from.id || !this.locale) {
			this.locale = await User.getLocale(msg)
			return
		}
	}

	getSubstrings(name) {
		if (!this.i18) {
			throw new Error('😅 You must define i18 dictionary 😅')
		}

		if (!this.locale) {
			throw new Error('Locale is not defined')
		}

		return this.i18[this.locale][name]
	}

	constructor() {
		this.handleOnCallbackQuery = this.handleOnCallbackQuery.bind(this)
		this.handleOnMessage = this.handleOnMessage.bind(this)
		this.handleRenderError = this.handleRenderError.bind(this)
		this.render = this.render.bind(this)

		this.messageHandlers = new Map()
		this.queriesHandlers = new Map()
		this.init()
	}

	init() {
		bot.on('callback_query', this.handleOnCallbackQuery)
		bot.on('message', this.handleOnMessage)
	}

	onMessage(messages = [], handler) {
		messages.forEach(item => {
			this.messageHandlers.set(item, handler)
		})
	}

	onCallbackQuery(queries = [], handler) {
		queries.forEach(item => {
			this.queriesHandlers.set(item, handler)
		})
	}

	handleOnCallbackQuery(payload) {
		const { data } = payload
		const splitted = data.replace(PATTERN_ARGS, '')

		if (this.queriesHandlers.has(splitted)) {
			this.queriesHandlers.get(splitted).apply(this, [payload])
		}
	}

	handleOnMessage(msg) {
		const { text } = msg

		if (this.messageHandlers.has(text)) {
			this.messageHandlers.get(text).apply(this, [msg])
		}
	}

	wrapActionName(name) {
		return `${this.actionsPattern}:${name}`
	}

	render(id, message, options) {
		bot.sendMessage(id, message, options).catch(this.handleRenderError)
	}

	rerender(id, message, options) {
		bot.sendMessage(id, message, options).catch(this.handleRenderError)
	}

	editRendered(msg, payload) {
		const additionParams = {
			message_id: msg.message.message_id,
			chat_id: msg.from.id,
		}

		if (payload.markup) {
			bot.editMessageReplyMarkup(payload.markup, additionParams)
		}

		if (payload.text) {
			bot.editMessageText(payload.text, additionParams)
		}
	}

	handleRenderError(err) {
		console.log(`Error on render ${this.name} view`, err)
	}
}

module.exports = AbstractView
