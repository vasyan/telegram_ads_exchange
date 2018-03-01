const R = require('ramda')
const bot = require('../engine')
const User = require('../data-adapter/user')

const PATTERN_ARGS = /@.+/

class AbstractView {
  get actionsPattern() {
    if (!this.name) {
      throw new Error('😅 You must define view name at the constructor 😅')
    }

    return this.name + `:action:`
  }

  async updateLocale(msg) {
    if (this.lastUserId !== msg.from.id || !this.locale) {
      this.locale = await User.getLocale(msg)
      return
    }
  }

  getSubstrings(path) {
    if (!this.i18) {
      throw new Error('😅 You must define i18 dictionary 😅')
    }

    if (!this.locale) {
      throw new Error('Locale is not defined')
    }

    return R.path(path.split('.'), this.i18[this.locale])
  }

  wrapActionName(name) {
    return `${this.actionsPattern}:${name}`
  }

  isEditableMessage(message) {
    return R.path(['message', 'from', 'is_bot'], message)
  }

  constructor() {
    this.handleOnCallbackQuery = this.handleOnCallbackQuery.bind(this)
    this.handleOnMessage = this.handleOnMessage.bind(this)
    this.handleRenderError = this.handleRenderError.bind(this)
    this.render = this.render.bind(this)

    this.messageHandlers = new Map()
    this.messagePatternsHandlers = new Map()
    this.queriesHandlers = new Map()

    this.init()
  }

  init() {
    bot.on('callback_query', this.handleOnCallbackQuery)
    bot.on('message', this.handleOnMessage)
  }

  onMessage(message, handler) {
    this.addEventListeners(message, handler, this.messageHandlers)
  }

  onMessagePattern(pattern, handler) {
    this.addEventListeners(pattern, handler, this.messagePatternsHandlers)
  }

  onCallbackQuery(query, handler) {
    this.addEventListeners(query, handler, this.queriesHandlers)
  }

  addEventListeners(event, handler, listeners) {
    if (Array.isArray(event)) {
      event.forEach(item => {
        listeners.set(item, handler)
      })

      return
    }

    listeners.set(event, handler)
  }

  handleOnCallbackQuery(payload) {
    const { data } = payload
    const splitted = data.replace(PATTERN_ARGS, '')

    if (this.queriesHandlers.has(splitted)) {
      this.runHandler(this.queriesHandlers.get(splitted), [payload])
    }
  }

  handleOnMessage(msg) {
    const { text } = msg

    if (this.messageHandlers.has(text)) {
      this.runHandler(this.messageHandlers.get(text), [msg])
    }

    this.messagePatternsHandlers.forEach((handler, key) => {
      const match = text.match(new RegExp(key))

      if (match) {
        this.runHandler(handler, [msg, match])
      }
    })
  }

  runHandler(handler, args) {
    try {
      handler.apply(this, args)
    } catch (err) {
      throw new Error('Error on handler', err)
    }
  }

  mergeOptionsWithdefault(options) {
    return Object.assign(
      {
        parse_mode: 'Markdown',
      },
      options
    )
  }

  render(id, message, options = {}) {
    return bot
      .sendMessage(id, message, this.mergeOptionsWithdefault(options))
      .catch(this.handleRenderError)
  }

  showError(id, body) {
    return bot.sendMessage(id, `❗️${body}❗️`)
  }

  editRendered(message, payload) {
    bot.editMessageText(message, payload)
  }

  handleRenderError(err) {
    console.log(`Error on render ${this.name} view`, err)
  }
}

module.exports = AbstractView
