var mongoose = require('mongoose')
var config = require('../config.js')
mongoose.connect(config.host + config.db)

// models
require('./user')
require('./subpage')
require('./message')

exports.User = mongoose.model('User')
exports.SubPage = mongoose.model('SubPage')
exports.Message = mongoose.model('Message')