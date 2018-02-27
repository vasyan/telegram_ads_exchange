const mongoose = require('mongoose')

const Schema = mongoose.Schema
const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
})

module.exports = {
  Model: mongoose.model('counter', counterSchema),
  Schema: counterSchema,
}
