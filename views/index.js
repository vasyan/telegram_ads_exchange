const ViewGreeting = require('./greeting')
const ViewChooseAudience = require('./choose-audience')
const ViewChooseCategory = require('./choose-category')
const ViewChoosePrice = require('./choose-price')
const ViewTesting = require('./testing')

console.log('ViewChooseAudience', ViewChooseAudience);

module.exports = {
  init: function () {
    ViewGreeting.init()
    ViewChooseAudience.init()
    ViewChooseCategory.init()
    ViewChoosePrice.init()
    ViewTesting.init()
  }
}
