const DataChannel = require('../../data-adapter/channel')
const ViewGreeting = require('../greeting')
const ViewChoosePrice = require('../choose-price')
const AbstractChooseCategoryView = require('./abstract')

class ChooseCategoryView extends AbstractChooseCategoryView {
  getRenderTriggers() {
    return [ViewGreeting.instance.actions.SELL]
  }

  getNextCallbackData() {
    return this.wrapActionName('next')
  }

  getItemViewText(item) {
    return this.getSubstrings('titles')[item.title]
  }

  getBodyText() {
    return this.getSubstrings('channelBody')
  }

  async handleShow(payload) {
    const { draft } = await DataChannel.getDraft(payload, {
      flush: true,
    })

    this.draft = draft

    super.handleShow(...arguments)
  }

  async handleSelect({ message, id }) {
    await DataChannel.setCategory(this.draft._id, id)
    ViewChoosePrice.instance._render.call(ViewChoosePrice.instance, message)
  }
}

const instance = new ChooseCategoryView({
  name: 'channel-choose-category-view',
})

module.exports = {
  instance,
}
