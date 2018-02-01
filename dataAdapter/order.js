const Order = require('../models/order')

function getAllOrders(query = {}) {
  return new Promise(resolve => {
    Order.find(query)
      .exec((err, orders) => {
        if (err) {
          throw err
        }

        resolve(orders)
      })
  })
}

function findOrder(query) {
  return new Promise(resolve => {
    Order.findOne(query)
      .exec((err, order) => {
        if (err) {
          throw err
        }

        resolve(order)
      })
  })
}

function addOrder(order) {
  return new Promise((resolve, reject) =>
    findOrder({ id: order.id })
      .then(dbOrderObject => {
        if (dbOrderObject) {
          resolve({ order: dbOrderObject, new: false })

          return
        }

        new Order(order)
          .save()
          .then(savedOrder => resolve({ order: savedOrder, new: true }))
          .catch(reject);
      })
  )
}


module.exports = {
  addOrder,
  findOrder,
  getAllOrders
}
