const R = require('ramda')

function flush(Model, id) {
  return new Promise(resolve => {
    const defaultModel = new Model().toJSON()

    Model.findByIdAndUpdate(
      id,
      R.omit(['_id'], defaultModel),
      { new: true },
      (err, order) => {
        resolve(order)
      }
    )
  }).catch(err => {
    throw new Error(`Can't flush model ${id}`, err)
  })
}

module.exports = {
  flush,
}
