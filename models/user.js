const mongoose = require('mongoose');
// const strings = require('../helpers/strings');

const Schema = mongoose.Schema;
const userSchema = new Schema({
  id: Number,
  firstName: String,
  lastName: String,
  username: String,
  bio: String,
  input_state: String,
  channels: [{
    type: Schema.ObjectId,
    ref: 'channel',
    default: [],
  }],
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
    type: Number,
    default: 0,
  },
  orders: [{
    type: Schema.ObjectId,
    ref: 'order',
    required: true,
    default: [],
  }],
  // orderDrafts: [{
  //   type: Schema.ObjectId,
  //   ref: 'order',
  //   requred: true,
  //   default: [],
  // }],
  orderDraft: {
    type: Schema.ObjectId,
    ref: 'order',
    // requred: true,
  },
  specialSymbol: String,
}, { timestamps: true })

// const englishObjectId = '581d0b8db33e47e7008726bd'
// const russianObjectId = '581d0b8db33e47e7008726be'

module.exports = mongoose.model('user', userSchema);
