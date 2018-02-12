const AbstractView = require('../views/abstract')

class AbstractUiView extends AbstractView {
  constructor(params = {}) {
    super(...arguments)

    this.message = params.message
  }
}

module.exports = AbstractUiView
