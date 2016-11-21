var SubPage = require('../models').SubPage
var Message = require('../models').Message

exports.index = function(req, res) {
	if(!Boolean(req.session.user)) {
		res.redirect('/login')
		return
	}
	res.render('index', {
		user: req.session.user? req.session.user : {}
	})
}

exports.login = function(req, res) {
	res.render('login', { 
		title: 'Express',
		msg: '',
		user: req.session.user? req.session.user : {}
	});
}

exports.signup = function(req, res) {
	res.render('signup', { 
		title: 'Express',
		msg: '',
		user: req.session.user? req.session.user : {}
	});
}

exports.account = function(req, res) {
	if(!Boolean(req.session.user)) {
		res.redirect('/login')
		return
	}
	res.render('account', {
		user: req.session.user? req.session.user : {},
		account_msg: ''
	})
}

exports.subpage = function(req, res) {
	if(!Boolean(req.session.user)) {
		res.redirect('/login')
		return
	}
	res.render('subpage', {
		user: req.session.user? req.session.user : {},
	})
}

exports.subpage_ueditor = function(req, res) {
	if(!Boolean(req.session.user)) {
		res.redirect('/login')
		return
	}
	var current_page = req.query.page;
	SubPage.findOne({'title': current_page}).exec(function(err, subpage) {
		if(err) {
			return res.render('subpage_ueditor', {
				user: req.session.user? req.session.user : {},
				err_msg: err,
				current_page: current_page
			})
		}
		if(Boolean(subpage)) {
			res.render('subpage_ueditor', {
				user: req.session.user? req.session.user : {},
				subPage: subpage,
				msg: ''
			})
			return
		}
	})
}

exports.message = function(req, res) {
	if(!Boolean(req.session.user)) {
		res.redirect('/login')
		return
	}
	Message.find({}).exec(function(err, messages){
		// if(err)
		res.render('message', {
			user: req.session.user? req.session.user : {},
			messages: messages
		})
	})
}

exports.project = function(req, res) {
	if(!Boolean(req.session.user)) {
		res.redirect('/login')
		return
	}
	Message.find({}).exec(function(err, messages){
		// if(err)
		res.render('project', {
			user: req.session.user? req.session.user : {},
			messages: messages
		})
	})
}

exports.project_ueditor = function(req, res) {
	if(!Boolean(req.session.user)) {
		res.redirect('/login')
		return
	}
	var pro_name = req.query.pro_name
	if(!Boolean(pro_name)) {
		
	}
	
			res.render('project_ueditor', {
				user: req.session.user? req.session.user : {},
				msg: ''
			})
			return
}
