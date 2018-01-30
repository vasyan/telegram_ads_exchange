const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const SchemaCategory = new Schema({
  id: ObjectId,
  title: String,
}, { collection: 'categories' });

module.exports = SchemaCategory
