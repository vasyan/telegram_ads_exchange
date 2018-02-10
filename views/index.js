const ViewGreeting = require('./greeting')
const ViewChooseAudience = require('./choose-audience')
const ViewChooseCategory = require('./choose-category')
const ViewChoosePrice = require('./choose-price')
const ViewTesting = require('./testing')

module.exports = {
  init: function () {
    // ViewGreeting.init()
    ViewChooseAudience.init()
    // ViewChooseCategory.init()
    ViewChoosePrice.init()
    // ViewTesting.init()
  }
}
