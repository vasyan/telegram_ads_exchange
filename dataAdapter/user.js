const mongoose = require('mongoose');

const ModelUser = require('../models/user')
const ModelOrder = require('../models/order')
const DataOrder = require('./order')

async function getAllUsers(query = {}) {
  return await ModelUser.find(query)
}

async function findUser(query) {
  return await ModelUser.findOne(query)
    .populate([
      'orderDraft',
      {
        path: 'orderDraft',
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
    ])
}

async function findUserById(id) {
  return await ModelUser.findById(id)
    // .populate(['categories', 'jobs', 'job_draft', 'reviews', 'reports'])
    .populate(['orderDraft'])
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

async function getLocale(msg) {
  const user = await findUser({ id: msg.from.id })

  if (!user || user.interfaceLanguage === 0) {
    return 'RUSSIAN'
  }

  return 'ENGLISH'
}

async function createOrderDraft (msg, { flush }) {
  const user = await ModelUser.findOne({ id: msg.from.id })

  if (user && user.orderDraft) {
    if (flush) {
      await DataOrder.flushOrder(user.orderDraft)
    }

    return await findUserById(user._id)
  } else {
    const newOrder = new ModelOrder({})

    user.orderDraft = newOrder._id
    await DataOrder.addOrder(newOrder)

    const newUser = await user.save()

    return await findUserById(newUser._id)
  }
}


module.exports = {
  getAllUsers,
  findUser,
  findUserById,
  addUser,
  getLocaleFromUser,
  getLocale,
  createOrderDraft
}
