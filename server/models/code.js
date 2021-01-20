const mongoose = require('mongoose');

const Code = mongoose.model(
    'Code',
    new mongoose.Schema({
      code: String,
    }),
);
module.exports = Code;
