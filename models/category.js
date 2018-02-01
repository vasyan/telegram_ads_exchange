const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const categorySchema = new Schema({
  title: String,
  // advertisers: [{
  //   type: Schema.ObjectId,
  //   ref: 'user',
  //   required: true,
  //   default: [],
  // }],
})

module.exports = mongoose.model('category', categorySchema);
