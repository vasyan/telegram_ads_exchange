const mongoose = require('mongoose')

const Schema = mongoose.Schema
const orderSchema = new Schema(
  {
    state: {
      type: Number,
      // required: true,
      // default: strings().orderStates.searchingForFreelancer,
      default: 0,
    },
    currentInlineMessage_id: String,
    currentInlineChatId: String,
    advertiserChatInlines: [
      {
        type: Schema.ObjectId,
        ref: 'userChatInline',
        // required: true,
        default: [],
      },
    ],
    language: {
      type: Schema.ObjectId,
      ref: 'language',
    },
    description: String,
    priceHigh: String,
    priceLow: String,
    audienceHigh: Number,
    audienceLow: Number,
    reviewByClient: {
      type: Schema.ObjectId,
      ref: 'review',
    },
    reviewByAdvertiser: {
      type: Schema.ObjectId,
      ref: 'review',
    },
    reports: [
      {
        type: Schema.ObjectId,
        ref: 'report',
      },
    ],
    reportedBy: [
      {
        type: Schema.ObjectId,
        ref: 'user',
      },
    ],
    // categories: Array,
    categories: [
      {
        type: Schema.ObjectId,
        ref: 'category',
        default: [],
      },
    ],
    client: {
      type: Schema.ObjectId,
      ref: 'user',
      // required: true,
    },
    candidates: [
      {
        type: Schema.ObjectId,
        ref: 'cannel',
        // required: true,
        default: [],
      },
    ],
    interestedCandidates: [
      {
        type: Schema.ObjectId,
        ref: 'channel',
        // required: true,
        default: [],
      },
    ],
    notInterestedCandidates: [
      {
        type: Schema.ObjectId,
        ref: 'channel',
        // required: false,
        default: [],
      },
    ],
    selectedCandidate: {
      type: Schema.ObjectId,
      ref: 'channel',
    },
    currentPage: {
      type: Number,
      default: 0,
    },
    remindersFired: [
      {
        type: String,
        // required: true,
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = {
  Model: mongoose.model('order', orderSchema),
  Schema: orderSchema,
}
