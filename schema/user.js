// const mongoose = require('mongoose');
//
// const Schema = mongoose.Schema;
// const userSchema = new Schema({
//   id: Number,
//   first_name: String,
//   last_name: String,
//   username: String,
//   bio: String,
//   input_state: String,
//   channels: Array,
//   categories: [{
//     type: Schema.ObjectId,
//     ref: 'category',
//     required: true,
//     default: [],
//   }],
//   languages: [{
//     type: Schema.ObjectId,
//     ref: 'language',
//   }],
//   interfaceLanguage: {
//     type: Schema.ObjectId,
//     ref: 'language',
//   },
//   orders: [{
//     type: Schema.ObjectId,
//     ref: 'order',
//     required: true,
//     default: [],
//   }],
//   order_drafts: [{
//     type: Schema.ObjectId,
//     ref: 'order',
//     requred: true,
//     default: [],
//   }],
//   specialSymbol: String,
// }, { timestamps: true })
//
// module.exports = mongoose.model('user', userSchema);
