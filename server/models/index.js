const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require('./user');
db.role = require('./role');
db.codes = require('./code');

db.ROLES = ['organizer', 'shareholder'];

module.exports = db;
