const _ = require('lodash')
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

function flushOrder(id) {
  return new Promise((resolve) => {
    const defaultOrder = new Order().toJSON()
    console.log('-------', id, defaultOrder);
    Order.findByIdAndUpdate(id, _.omit(defaultOrder, ['_id']), resolve)
  })
}

function setAudience(id, range = [0, Infinity]) {
  return new Promise((resolve) => {
    Order.findByIdAndUpdate(id, {
      audienceLow: range[0],
      audienceHigh: range[1]
    }, resolve)
  })
}


module.exports = {
  addOrder,
  findOrder,
  getAllOrders,
  flushOrder,
  setAudience
}
