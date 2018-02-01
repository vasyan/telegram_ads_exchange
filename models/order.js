const mongoose = require('mongoose');
// const strings = require('../helpers/strings');

const Schema = mongoose.Schema;
const orderSchema = new Schema({
  state: {
    type: String,
    required: true,
    // default: strings().orderStates.searchingForFreelancer,
    default: 'Поиск исполнителя'
  },
  current_inline_message_id: String,
  current_inline_chat_id: String,
  advertiser_chat_inlines: [{
    type: Schema.ObjectId,
    ref: 'userChatInline',
    required: true,
    default: [],
  }],
  language: {
    type: Schema.ObjectId,
    ref: 'language',
  },
  description: String,
  price: String,
  reviewByClient: {
    type: Schema.ObjectId,
    ref: 'review',
  },
  reviewByAdvertiser: {
    type: Schema.ObjectId,
    ref: 'review',
  },
  reports: [{
    type: Schema.ObjectId,
    ref: 'report',
  }],
  reportedBy: [{
    type: Schema.ObjectId,
    ref: 'user',
  }],
  category: {
    type: Schema.ObjectId,
    ref: 'category',
  },
  client: {
    type: Schema.ObjectId,
    ref: 'user',
    required: true,
  },
  candidates: [{
    type: Schema.ObjectId,
    ref: 'user',
    required: true,
    default: [],
  }],
  interestedCandidates: [{
    type: Schema.ObjectId,
    ref: 'user',
    required: true,
    default: [],
  }],
  notInterestedCandidates: [{
    type: Schema.ObjectId,
    ref: 'user',
    required: false,
    default: [],
  }],
  selectedCandidate: {
    type: Schema.ObjectId,
    ref: 'user',
  },
  current_page: {
    type: Number,
    default: 0,
  },
  remindersFired: [{
    type: String,
    required: true,
    default: [],
  }],
},
{
    timestamps: true
});

module.exports = mongoose.model('order', orderSchema);
