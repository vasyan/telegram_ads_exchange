const Category = require('../models/category')

function getAllCategories(query = {}) {
  return new Promise(resolve => {
    Category.find(query)
      .exec((err, categories) => {
        if (err) {
          throw err
        }

        resolve(categories)
      })
  })
}

module.exports = {
  getAllCategories
}
