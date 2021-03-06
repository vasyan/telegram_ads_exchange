const bot = require('./engine')
// const Menus = require('./menus')
require('./views')
require('./db')

// var ModelUser = mongoose.model('User', SchemaUser)

bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id
  const resp = match[1]

  bot.sendMessage(chatId, resp)
})

bot.onText(/\/register/, (msg, match) => {})

bot.onText(/\/whoami/, msg => {
  // const chatId = msg.chat.id
  // const username = msg.chat.username
  // ModelUser.find({ userId: chatId }, function(err, users) {
  //   if (users.length === 0) {
  //     const user = new ModelUser({
  //       userId: chatId,
  //       username: username,
  //     })
  //     user.save(function(err, user) {
  //       if (err) {
  //         return console.error('Save model error', err)
  //       }
  //       bot.sendMessage(chatId, 'Entity created')
  //     })
  //   } else {
  //     bot.sendMessage(chatId, 'Hello, ' + users[0].username)
  //   }
  // })
  // bot.sendMessage(chatId, 'nope').catch(function(err) {
  //   console.log('Err', err)
  // })
})

bot.on('callback_query', payload => {})

bot.on('message', payload => {})

bot.on('polling_error', error => {})
