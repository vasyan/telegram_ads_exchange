const ModelUser = require('../models/user')
const ModelOrder = require('../models/order')
const DataOrder = require('./order')

function getAllUsers(query = {}) {
  return new Promise(resolve => {
    ModelUser.find(query)
      // .populate(['reviews'])
      .exec((err, users) => {
        if (err) {
          throw err
        }

        resolve(users)
      })
  })
}

function findUser(query) {
  return new Promise(resolve => {
    ModelUser.findOne(query)
      .populate([
        'orderDraft'
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
      ])
      .exec((err, user) => {
        if (err) {
          throw err
        }

        resolve(user)
      })
  })
}

function findUserById(id) {
  return new Promise(resolve => {
    ModelUser.findById(id)
      // .populate(['categories', 'jobs', 'job_draft', 'reviews', 'reports'])
      .populate(['orderDraft'])
      .exec((err, user) => {
        if (err) {
          throw err
        }

        if (!user) {
          throw new Error('No user found')
        }

        resolve(user)
      })
  })
}

function addUser(user) {
  return new Promise((resolve, reject) =>
    findUser({ id: user.id })
      .then(dbUserObject => {
        if (dbUserObject) {
          resolve({ user: dbUserObject, new: false })

          return
        }

        new ModelUser(user)
          .save()
          .then(savedUser => resolve({ user: savedUser, new: true }))
          .catch(reject)
      })
  );
}

function getLocaleFromUser(user) {
  if (!user || user.interfaceLanguage === 0) {
    return 'RUSSIAN'
  }

  return 'ENGLISH'
}

function getLocale(msg) {
  return new Promise((resolve) => {
    findUser({ id: msg.from.id }).then((user) => {
      if (!user || user.interfaceLanguage === 0) {
        resolve('RUSSIAN')

        return
      }

      resolve('ENGLISH')
    })
  })
}

function createOrderDraft (msg, { flush }) {
  return new Promise((resolve) => {
    ModelUser.findOne({ id: msg.from.id }).then((user) => {
      if (user && user.orderDraft) {
        if (flush) {
          DataOrder.flushOrder(user.orderDraft).then(() => {
            findUserById(user._id).then(resolve)
          })
        } else {
          findUserById(user._id).then(resolve)
        }
      } else {
        const newOrder = new ModelOrder({})

        user.orderDraft = newOrder._id
        DataOrder.addOrder(newOrder)

        user.save().then((user) => {
          findUserById(user._id).then(resolve)
        })
      }
    })
  })
}


module.exports = {
  getAllUsers,
  findUser,
  findUserById,
  addUser,
  getLocaleFromUser,
  _getLocale,
  createOrderDraft
}
