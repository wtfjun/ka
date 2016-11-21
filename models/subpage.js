var mongoose = require('mongoose')

var SubPageSchema = new mongoose.Schema({
	title: { type: String },
	content: { type: String }
})

mongoose.model('SubPage', SubPageSchema);