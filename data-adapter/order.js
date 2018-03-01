const R = require('ramda')
const { Model } = require('../models/order')

function getAllOrders(query = {}) {
  return new Promise(resolve => {
    Model.find(query).exec((err, orders) => {
      if (err) {
        throw err
      }

      resolve(orders)
    })
  })
}

function findOrder(query) {
  return new Promise(resolve => {
    Model.findOne(query).exec((err, order) => {
      if (err) {
        throw err
      }

      resolve(order)
    })
  })
}

function findOrderById(id) {
  return new Promise(resolve => {
    Model.findById(id).exec((err, order) => {
      if (err) {
        throw err
      }

      resolve(order)
    })
  })
}

function addOrder(order) {
  return new Promise((resolve, reject) =>
    findOrder({ id: order.id }).then(dbOrderObject => {
      if (dbOrderObject) {
        resolve({ order: dbOrderObject, new: false })

        return
      }

      new Model(order)
        .save()
        .then(savedOrder => resolve({ order: savedOrder, new: true }))
        .catch(reject)
    })
  )
}

function flushOrder(id) {
  return new Promise(resolve => {
    const defaultOrder = new Model().toJSON()

    Model.findByIdAndUpdate(
      id,
      R.omit(['_id'], defaultOrder),
      { new: true },
      (err, order) => {
        resolve(order)
      }
    )
  }).catch(err => {
    throw new Error(`Can't flush order ${id}`, err)
  })
}

function setAudience(id, range = [0, Infinity]) {
  return new Promise(resolve => {
    Model.findByIdAndUpdate(
      id,
      {
        audienceLow: range[0],
        audienceHigh: range[1],
      },
      resolve
    )
  })
}

function setPrice(id, range = [0, Infinity]) {
  return new Promise(resolve => {
    Model.findByIdAndUpdate(
      id,
      {
        priceLow: range[0],
        priceHigh: range[1],
      },
      resolve
    )
  })
}

// Schema.pre('save', function(next) {
//   const document = this

//   console.log('post save')

//   ModelCounter.findByIdAndUpdate(
//     { _id: 'order' },
//     { $inc: { seq: 1 } },
//     function(error, counter) {
//       if (error) {
//         return next(error)
//       }

//       document.id = counter.seq
//       next()
//     }
//   )
// })

module.exports = {
  addOrder,
  findOrder,
  findOrderById,
  getAllOrders,
  flushOrder,
  setAudience,
  setPrice,
}
