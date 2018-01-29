const bot = require('./engine')
const mongoose = require('mongoose')
const Views = require('./views')
const SchemaUser = require('./schema/user')
// const handleBuy = require('./handlers/buy')
// const handleSell = require('./handlers/sell')
// const CallbackQuery = require('./callbacks/query')

mongoose.connect('mongodb://localhost/my_database');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db has been connected')
});

// var Schema = mongoose.Schema;
// var ObjectId = Schema.ObjectId;

Views.init()

var ModelUser = mongoose.model('User', SchemaUser);

// var Woopa = new SchemaUser({
//   userId:
// })

// Устанавливаем токен, который выдавал нам бот.
// Create a bot that uses 'polling' to fetch new updates
// const bot = new TelegramBot(token, {polling: true});


function handleWannaPosting (id) {
  bot.sendMessage(
    id,
    `Выберите желаемый бюджет`,
    {
      reply_markup: {
        keyboard: [['Подать'], ['Разместить']],
        resize_keyboard: true
      }
    }
  ).catch(function (err) {
    console.log('Err', err);
  })
}

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/register/, (msg, match) => {
})

bot.onText(/\/whoami/, (msg, match) => {
  // console.log('msg', msg.chat)
  const chatId = msg.chat.id;
  const username = msg.chat.username

  ModelUser.find({ userId: chatId }, function (err, users) {
    // console.log('result ', users);

    if (users.length === 0) {
      const user = new ModelUser({
        userId: chatId,
        username: username
      })

      user.save(function (err, user) {
        if (err) {
          return console.error('Save model error', err);
        }

        bot.sendMessage(chatId, 'Entity created');
      })
    } else {
      bot.sendMessage(chatId, 'Hello, ' + users[0].username );
    }

  });

  bot.sendMessage(chatId, 'nope').catch(function (err) {
    console.log('Err', err);
  })
})

bot.onText(/\Купить/, handleBuy)
bot.onText(/\Продать/, handleSell)


// bot.onText(/\/start/, (msg, match) => {
//   const { id } = msg.chat
//
//   bot.sendMessage(id, getPostingStep0(), {
//     reply_markup: {
//       keyboard: [['Подать'], ['Разместить'], ['/whoami']],
//       resize_keyboard: true
//     }
//   }).catch(function (err) {
//     console.log('Err', err);
//   })
// })
// Listen for any kind of message. There are different kinds of
// messages.

bot.on('callback_query', (payload) => {
  // CallbackQuery.handle(payload)
})

let inited = false

bot.on('message', ({ chat }) => {
  const chatId = chat.id;

  // send a message to the chat acknowledging receipt of their message
  // bot.sendMessage(chatId, 'Received your message');
  if (!inited) {
    inited = true

    bot.sendMessage(chatId, '', {
      reply_markup: {
        keyboard: [['/whoami']],
        resize_keyboard: true
      }
    }).catch(function (err) {
      console.log('Err', err);
    })
  }
});

bot.on('polling_error', (error) => {
  console.log(error);  // => 'EFATAL'
});
