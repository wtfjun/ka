var SubPage = require('../models').SubPage
var Message = require('../models').Message
var Project = require('../models').Project

exports.subpage = function(req, res) {
	var title = req.query.title
	SubPage.findOne({'title': title}).exec(function(err, subpage){
		// if(err)
		res.jsonp({
			status: 'success',
			subpage: subpage
		})
	}) 
}

exports.message = function(req, res) {
	var name = req.query.name
	var email = req.query.email
	var subject = req.query.subject
	var message = req.query.message

	var a_message = new Message()
	a_message.name = name
	a_message.email = email
	a_message.subject = subject
	a_message.message = message
	console.log(a_message)
	a_message.save(function(err) {
		if(err) {
			res.jsonp({
				status: 'fail'
			})
			return
		}
		res.jsonp({
			status: 'success'
		})
	})
}

exports.fourProjects = function(req, res) {
	Project.find({}).limit(4).exec(function(err, projects) {
		if(err) {
			res.jsonp({
				status: 'fail'
			})
			return
		}
		res.jsonp({
			status: 'success',
			projects: projects
		})
	})
}

exports.allProjects = function(req, res) {
	Project.find({}).exec(function(err, projects) {
		if(err) {
			res.jsonp({
				status: 'fail'
			})
			return
		}
		res.jsonp({
			status: 'success',
			projects: projects
		})
	})
}

exports.project = function(req, res) {
	var name = req.query.name
	console.log(name)
	Project.findOne({'name': name}).exec(function(err, project) {
		if(err) {
			res.jsonp({
				status: 'fail'
			})
			return
		}
		console.log(project)
		res.jsonp({
			status: 'success',
			project: project
		})
	})
}