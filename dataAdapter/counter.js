const { Model } = require('../models/counter')

function getAllCounters(query = {}) {
  return new Promise(resolve => {
    Model.find(query).exec((err, categories) => {
      if (err) {
        throw err
      }

      resolve(categories)
    })
  })
}

module.exports = {
  getAllCounters,
}
