var mongoose = require('mongoose')

var ProjectSchema = new mongoose.Schema({
	name: { type: String },
	intro: { type: String },
	more_intro: { type: String },
	imgs: { type: [] },
	create_at: { type: Date, default: Date.now }
})

mongoose.model('Project', ProjectSchema);