const R = require('ramda')
const { Model: ModelUser } = require('../models/user')
const { Model: ModelOrder } = require('../models/order')
const { Model: ModelCounter } = require('../models/counter')
const DataOrder = require('./order')

const commonPopulate = [
  {
    path: 'order',
    populate: {
      path: 'category',
      model: 'category',
    },
  },
  'orders',
  {
    path: 'counter',
    populate: {
      path: 'category',
      model: 'category',
    },
  },
  // 'categories',
  // 'jobs',
  // 'job_draft',
  // 'reviews',
  // 'languages',
  // {
  //   path: 'jobs',
  //   populate: {
  //     path: 'category',
  //     model: 'category',
  //   },
  // },
  // {
  //   path: 'job_draft',
  //   populate: {
  //     path: 'category',
  //     model: 'category',
  //   },
  // },
]

function getAllUsers(query = {}) {
  return new Promise(resolve => {
    ModelUser.find(query).exec((err, user) => {
      if (err) {
        throw err
      }

      resolve(user)
    })
  })
}

function findUser(query) {
  return new Promise(resolve => {
    ModelUser.findOne(query)
      .populate(commonPopulate)
      .exec((err, user) => {
        if (err) {
          throw err
        }

        resolve(user)
      })
  })
}

function findByMessage(message) {
  return findUser({ id: message.from.id })
}

function findUserById(id) {
  return ModelUser.findById(id).populate(commonPopulate)
}

function addUser(user) {
  return new Promise((resolve, reject) =>
    findUser({ id: user.id }).then(dbUserObject => {
      if (dbUserObject) {
        resolve({ user: dbUserObject, new: false })

        return
      }

      new ModelUser(user)
        .save()
        .then(savedUser => resolve({ user: savedUser, new: true }))
        .catch(reject)
    })
  )
}

function getLocaleFromUser(user) {
  if (!user || user.interfaceLanguage === 0) {
    return 'RUSSIAN'
  }

  return 'ENGLISH'
}

const isInvalidMessage = R.compose(R.isNil, R.path(['from', 'id']))
const validateMessage = R.when(isInvalidMessage, handleInvalidMessage)

function handleInvalidMessage() {
  throw new Error('😂 Message is invalid 😂')
}

function getLocaleByUser(user) {
  if (user && user.interfaceLanguage === 0) {
    return 'RUSSIAN'
  }

  return 'ENGLISH'
}

async function getLocale(message) {
  validateMessage(message)

  // Подумой
  // return R.composeP(
  //   R.curry(user => Promise.resolve(getLocaleByUser(user))),
  //   findUser
  // )
  const user = await findUser({ id: message.from.id })

  return getLocaleByUser(user)
}

function getUserUncompletedOrderDraft(user) {
  const { orders } = user

  if (orders) {
    return R.find(R.propEq('state', 0))(orders) || null
  }

  return null
}

async function getOrderDraft(message, params = {}) {
  let user = await findByMessage(message)
  let currentDraft = getUserUncompletedOrderDraft(user)

  if (currentDraft) {
    if (params.flush) {
      currentDraft = await DataOrder.flushOrder(currentDraft._id)
    }
  } else {
    currentDraft = new ModelOrder({})

    user.orders.push(currentDraft._id)

    await DataOrder.addOrder(currentDraft)

    user = await user.save()
  }

  return { user, order: currentDraft }
}

function finishOrderDraft(message) {
  return new Promise(async resolve => {
    const { user, order } = await getOrderDraft(message)

    if (user && order) {
      ModelCounter.findByIdAndUpdate(
        { _id: 'order' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
        (err, counter) => {
          if (err) {
            throw new Error(`Can't update order counter`)
          }

          return ModelOrder.findByIdAndUpdate(
            { _id: order._id },
            {
              state: 1,
              number: counter.seq,
            },
            { new: true },
            (err, order) => {
              if (err) {
                throw new Error(`Can't update order state`)
              }

              resolve(order)
            }
          )
        }
      )
    } else {
      throw new Error(`Can't mark order as finished`)
    }
  })
}

async function getActiveOrders(message) {
  const user = await findByMessage(message)

  if (user.orders.lenght === 0) {
    return null
  }

  return user.orders.filter(order => order.state === 1)
}

module.exports = {
  getAllUsers,
  findUser,
  findUserById,
  findByMessage,
  addUser,
  getLocaleFromUser,
  getLocale,
  getLocaleByUser,
  getOrderDraft,
  getActiveOrders,
  finishOrderDraft,
}
