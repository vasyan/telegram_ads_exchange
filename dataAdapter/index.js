const { Model } = require('../models/user')

function getAllUsers(query = {}) {
  return new Promise(resolve => {
    Model.find(query)
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
    Model.findOne(query)
      .populate([
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
    Model.findById(id)
      // .populate(['categories', 'jobs', 'job_draft', 'reviews', 'reports'])
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

// TODO видимо удалить за ненадобностью
function addUser(user) {
  return new Promise((resolve, reject) =>
    findUser({ id: Model.id }).then(dbUserObject => {
      if (dbUserObject) {
        resolve({ user: dbUserObject, new: false })

        return
      }

      new Model(user)
        .save()
        .then(savedUser => resolve({ user: savedUser, new: true }))
        .catch(reject)
    })
  )
}

module.exports = {
  addUser,
  getAllUsers,
  findUser,
  findUserById,
}
