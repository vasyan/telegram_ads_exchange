const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const SchemaPostRequest = new Schema({
  id: ObjectId,
  title: String,
}, { collection: 'categories' });

module.exports = SchemaPostRequest
