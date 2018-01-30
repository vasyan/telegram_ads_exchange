const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const SchemaUser = new Schema({
  id: ObjectId,
  userId: String,
  username: String,
  channels: Array,
  subscriptions: Array
});

SchemaUser.methods.exists = function () {}

module.exports = SchemaUser
