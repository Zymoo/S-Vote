const mongoose = require('mongoose');

const schema = mongoose.Schema({
  tag: String,
  content: String,
});

module.exports = mongoose.model('Block', schema);
