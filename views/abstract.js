const _ = require('lodash')
const bot = require('../engine')

class Command {
  // getUser () {
  //   if (this.user) {
  //     return this.user
  //   }
  //
  //
  // }

  get actionsPattern () {
    if (!this.name) {
      throw new Error('You must define view name at the constructor')
    }

    return this.name + `:action:`
  }

  constructor (options) {
    // this.options = Object.clone(options)
    // this.chatId = options.chatId
    // this.actions = options.actions
    // this.actionsPattern = `${options.name}:action:`
    this.handleOnCallbackQuery = this.handleOnCallbackQuery.bind(this)
    this.handleOnMessage = this.handleOnMessage.bind(this)

    this.messageHandlers = new Map()
    this.init()
  }

  init () {
    bot.on('callback_data', this.handleOnCallbackQuery)
    bot.on('message', this.handleOnMessage)
  }

  onMessage (messages = [], handler) {
    messages.forEach((item) => {
      this.messageHandlers.set(item, handler)
    })
  }

  handleOnCallbackQuery (payload) {
    if (payload.data.indexOf(this.actionsPattern) !== -1) {
      const action = payload.data.match(/:action:(\w+)/)[1]
      const actionHandlerName = `handleAction${action.charAt(0).toUpperCase() + action.slice(1)}`

      if (typeof this[actionHandlerName] === 'function') {
        this[actionHandlerName](payload)
      }
    }
  }

  handleOnMessage (msg) {
    const { text } = msg

    if (this.messageHandlers.has(text)) {
      this.messageHandlers.get(text).apply(this, [msg])
    }
  }

  render (id, message, options) {
    bot
      .sendMessage(id, message, options)
      .catch(this.handleRenderError)
  }

  rerender (id, message, options) {
    bot
      .sendMessage(id, message, options)
      .catch(this.handleRenderError)
  }

  handleRenderError (err) {
    console.log(`Error on render ${this.name} view`, err)
  }
}

module.exports = Command
