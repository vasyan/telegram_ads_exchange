const Greeting = require('./greeting')
const ChooseCategory = require('./choose-category')
const ChannelChooseCategory = require('./choose-category/channel')
const ChooseAudience = require('./choose-audience')
const ChoosePrice = require('./choose-price')
const MyOrders = require('./my-orders')
const Order = require('./order')
const Testing = require('./testing')

module.exports = {
  ViewGreeting: Greeting,
  ViewOrder: Order,
  ViewMyOrders: MyOrders,
  ViewChoosePrice: ChoosePrice,
  ViewChooseAudience: ChooseAudience,
  ViewChooseCategory: ChooseCategory,
  ViewChannelChooseCategory: ChannelChooseCategory,
  ViewTesting: Testing,
}
