const mongoose = require('mongoose')

const Schema = mongoose.Schema
const channelSchema = new Schema(
  {
    name: String,
    link: String,
    description: String,
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: Schema.ObjectId,
      required: true,
    },
    number: {
      type: Number,
      default: 0,
    },
    audience: Number,
    rating: Number,
    reviews: [
      {
        type: Schema.ObjectId,
        ref: 'review',
      },
    ],
    categories: [
      {
        type: Schema.ObjectId,
        ref: 'category',
        required: true,
        default: [],
      },
    ],
    language: {
      type: Schema.ObjectId,
      ref: 'language',
    },
    // languages: [
    //   {
    //     type: Schema.ObjectId,
    //     ref: 'language',
    //     default: [],
    //   },
    // ],
    views: [
      {
        type: Number,
        default: 0,
      },
    ],
    orders: [
      {
        type: Schema.ObjectId,
        ref: 'order',
        // required: true,
        default: [],
      },
    ],
    specialSymbol: String,
  },
  { timestamps: true }
)

module.exports = {
  Model: mongoose.model('channel', channelSchema),
  Schema: channelSchema,
}
