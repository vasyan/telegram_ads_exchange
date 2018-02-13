const mongoose = require('mongoose')

const Schema = mongoose.Schema
const categorySchema = new Schema({
  title: String,
  id: Number,
})

module.exports = {
  Model: mongoose.model('category', categorySchema),
  Schema: categorySchema,
}
