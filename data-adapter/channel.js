const DataUser = require('./user')
const { Model: ModelChannel } = require('../models/channel')
const Utils = require('./utils')

function getUncompletedDraftByUser(Model, user) {
  return Model.findOne({ state: 0, ownerId: user._id })
}

async function getDraft(message, params = {}) {
  let user = await DataUser.findByMessage(message)
  let draft = await getUncompletedDraftByUser(ModelChannel, user)

  // draft = await R.composeP(
  //   R.curry(getUncompletedDraftByUser)(ModelChannel),
  //   DataUser.findByMessage
  // )(message)

  if (draft) {
    if (params.flush) {
      draft = await Utils.flush(ModelChannel, draft._id)
    }
  } else {
    draft = new ModelChannel({ ownerId: user._id })
    draft.save()
  }

  return { user, draft }
}

function setCategory(id, category) {
  return new Promise(resolve => {
    ModelChannel.findByIdAndUpdate(
      id,
      {
        $push: { categories: category },
      },
      resolve
    )
  })
}

module.exports = {
  getDraft,
  setCategory,
}
