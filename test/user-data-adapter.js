process.env.NODE_ENV = 'test'
process.env.TEST_MONGODB = 'mongodb://localhost/ad-bot-testing'

const { mongoose } = require('../db')
const catNames = require('cat-names')
const R = require('ramda')

const chai = require('chai')
const assert = chai.assert
const { Model: ModelUser } = require('../models/user')
const { Model: ModelOrder } = require('../models/order')
const { Model: ModelCounter } = require('../models/counter')
const User = require('../dataAdapter/user')

function getUser() {
  return {
    username: catNames.random(),
    id: Math.floor(Math.random() * (9999999 - 1000000)) + 1000000,
  }
}

function generateUsers(count) {
  return Promise.all(
    R.times(() => {
      return new ModelUser(getUser()).save()
    }, count)
  )
}

function getUserWithOrders(payload = {}) {
  const { count = 1, params = {} } = payload
  return new Promise(resolve => {
    const user = new ModelUser(getUser())

    const orders = []

    R.times(value => {
      let orderData = {}

      if (params[value]) {
        orderData = params[value]
      }

      orders.push(new ModelOrder(orderData))
    }, count)

    user.orders = orders

    user.save(err => {
      if (err) {
        throw err
      }

      const promisesOrdersSave = R.map(order => {
        return new Promise(resolve =>
          order.save(err => {
            if (err) {
              console.log('error on save order', err)
            }
            resolve()
          })
        )
      }, orders)

      Promise.all(promisesOrdersSave).then(() => {
        resolve({ user, orders })
      })
    })
  })
}

describe('User data adapter', function() {
  beforeEach(done => {
    //Before each test we empty the database
    Promise.all([
      new Promise(resolve => ModelUser.remove({}, resolve)),
      new Promise(resolve => ModelOrder.remove({}, resolve)),
    ]).then(() => {
      done()
    })
  })

  after(function(done) {
    mongoose.models = {}
    mongoose.modelSchemas = {}
    mongoose.connection.close()

    done()
  })

  it('it should get all the users', done => {
    generateUsers(10).then(() => {
      User.getAllUsers().then(users => {
        assert(users.length === 10, 'users lenght is 10')

        done()
      })
    })
  })

  it('it should get user by id', done => {
    generateUsers(1).then(users => {
      User.findUser({ _id: users[0]._id }).then(user => {
        assert.isOk(user, 'user is exist')

        done()
      })
    })
  })

  it('it should get user by message', done => {
    generateUsers(2).then(users => {
      User.findUserByMessage({ from: { id: users[0].id } }).then(user => {
        assert.isOk(user, 'user is exist')

        done()
      })
    })
  })

  it(`it create new user if it doesn't exist`, done => {
    generateUsers(2).then(() => {
      User.addUser(getUser()).then(payload => {
        assert.isObject(payload.user, 'new user has been created')
        assert.isTrue(payload.new)

        done()
      })
    })
  })

  it(`it return existed user if it has been created before`, done => {
    generateUsers(2).then(users => {
      User.addUser(users[0]).then(payload => {
        assert.isOk(payload.user, 'existed user has been returned')
        assert.isNotOk(payload.isNew)

        done()
      })
    })
  })

  it(`it should mark order as active on create finish`, done => {
    getUserWithOrders().then(async ({ user }) => {
      const newOrder = await User.finishOrderDraft({ from: { id: user.id } })
      const orderCounter = await ModelCounter.findById('order')

      assert.equal(newOrder.state, 1, 'new status is active')
      assert.equal(newOrder.number, orderCounter.seq - 1, 'has fresh counter')

      done()
    })
  })

  it(`it should return active orders`, done => {
    getUserWithOrders({
      count: 5,
      params: { 1: { state: 1 }, 2: { state: 1 } },
    }).then(async ({ user }) => {
      const activeOrders = await User.getActiveOrders({ from: { id: user.id } })

      assert.equal(activeOrders.length, 2, 'is has two active orders')

      done()
    })
  })
})
