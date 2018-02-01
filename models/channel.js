const mongoose = require('mongoose');
// const strings = require('../helpers/strings');

const Schema = mongoose.Schema;
const userSchema = new Schema({
  id: Number,
  first_name: String,
  last_name: String,
  username: String,
  bio: String,
  categories: [{
    type: Schema.ObjectId,
    ref: 'category',
    required: true,
    default: [],
  }],
  languages: [{
    type: Schema.ObjectId,
    ref: 'language',
  }],
  interfaceLanguage: {
    type: Schema.ObjectId,
    ref: 'language',
  },
  orders: [{
    type: Schema.ObjectId,
    ref: 'order',
    required: true,
    default: [],
  }],
  order_drafts: [{
    type: Schema.ObjectId,
    ref: 'order',
    requred: true,
    default: [],
  }],
  specialSymbol: String,
}, { timestamps: true })

module.exports = mongoose.model('user', userSchema);
