const mongoose = require('mongoose')
// const strings = require('../helpers/strings');

const Schema = mongoose.Schema
const channelSchema = new Schema(
  {
    id: Number,
    name: String,
    bio: String,
    categories: [
      {
        type: Schema.ObjectId,
        ref: 'category',
        required: true,
        default: [],
      },
    ],
    orders: [
      {
        type: Schema.ObjectId,
        ref: 'order',
        required: true,
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
