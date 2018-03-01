const { Model } = require('../models/category')

function getAllCategories(query = {}) {
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
  getAllCategories,
}
