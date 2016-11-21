var mongoose = require('mongoose')

var MessageSchema = new mongoose.Schema({
	name: { type: String },
	email: { type: String },
	subject: { type: String },
	message: { type: String },
	create_at: { type: Date, default: Date.now }
})

mongoose.model('Message', MessageSchema);