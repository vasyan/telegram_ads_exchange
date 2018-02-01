const User = require('../models/user')

function getAllUsers(query = {}) {
  return new Promise(resolve => {
    User.find(query)
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
    User.findOne(query)
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
    User.findById(id)
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

function addUser(user) {
  return new Promise((resolve, reject) =>
    findUser({ id: user.id })
      .then(dbUserObject => {
        if (dbUserObject) {
          resolve({ user: dbUserObject, new: false })

          return
        }

        new User(user)
          .save()
          .then(savedUser => resolve({ user: savedUser, new: true }))
          .catch(reject);
      })
  );
}


function getLocale(user) {
  if (!user || !user.interfaceLanguage || String(user.interfaceLanguage._id) === englishObjectId || String(user.interfaceLanguage) === englishObjectId) {
    return 'ENGLISH';
  }

  return 'RUSSIAN';
}


module.exports = {
  getAllUsers,
  findUser,
  findUserById,
  addUser,
  getLocale,
}
