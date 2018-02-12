const ModelUser = require('../models/user')
const ModelOrder = require('../models/order')
const DataOrder = require('./order')

const commonPopulate = [
	'orderDraft',
	{
		path: 'orderDraft',
		populate: {
			path: 'category',
			model: 'category',
		},
	},
	'orders',
	{
		path: 'orders',
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

async function getAllUsers(query = {}) {
	return ModelUser.find(query)
}

async function findUser(query) {
	return ModelUser.findOne(query).populate(commonPopulate)
}

async function findUserByMessage(message) {
	return findUser({ id: message.from.id })
}

async function findUserById(id) {
	return await ModelUser.findById(id).populate(commonPopulate)
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

async function getLocale(msg) {
	const user = await findUser({ id: msg.from.id })

	if (!user || user.interfaceLanguage === 0) {
		return 'RUSSIAN'
	}

	return 'ENGLISH'
}

async function createOrderDraft(msg, { flush }) {
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

async function finishOrderDraft(msg) {
	const user = await ModelUser.findOne({ id: msg.from.id })

	if (user && user.orderDraft) {
		user.orders.push(user.orderDraft)
		user.orderDraft = null

		return await user.save()
	}
}

module.exports = {
	getAllUsers,
	findUser,
	findUserById,
	findUserByMessage,
	addUser,
	getLocaleFromUser,
	getLocale,
	createOrderDraft,
	finishOrderDraft,
}
