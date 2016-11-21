var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
	username: { type: String },
	password: { type: String },
	power: { type: Number, default: -1},
	create_at: { type: Date, default: Date.now }
})

mongoose.model('User', UserSchema);