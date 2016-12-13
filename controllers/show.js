var SubPage = require('../models').SubPage
var Message = require('../models').Message
var Project = require('../models').Project

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
	SubPage.find({}).exec(function(err, subpages) {
		if(err) {
			res.render('error', {
				err_msg: '查找子页面失败'+err,
				user:{}
			})
		}
		res.render('subpage', {
			user: req.session.user? req.session.user : {},
			subpages: subpages
		})
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
			res.render('error', {
		    err_msg: '查找子页面失败'+err,
		    user: {}
		  });
			return
		}
		if(Boolean(subpage)) {
			res.render('subpage_ueditor', {
				user: req.session.user? req.session.user : {},
				subPage: subpage,
				msg: ''
			})
			return
		}
		else {
			var subpage = new SubPage()
			subpage.title = current_page
			subpage.content = '1111111'
			subpage.save(function(err) {
				if(err) {
					res.render('error', {
				    err_msg: '保存子页面失败'+err,
				    user: {}
				  });
					return
				}
				res.render('subpage_ueditor', {
					user: req.session.user? req.session.user : {},
					subPage: subpage,
					msg: ''
				})
			})
		}
	})
}

exports.message = function(req, res) {
	if(!Boolean(req.session.user)) {
		res.redirect('/login')
		return
	}
	Message.find({}).exec(function(err, messages){
		if(err) {
			res.render('error', {
		    err_msg: '查找留言失败'+err,
		    user: {}
		  });
			return
		}
		console.log(messages)
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
	Project.find({}).exec(function(err, projects){
		if(err) {
			res.render('error', {
		    err_msg: '查找项目失败'+err,
		    user: {}
		  });
			return
		}
		res.render('project', {
			user: req.session.user? req.session.user : {},
			projects: projects
		})
		return
	})
}

exports.project_add = function(req, res) {
	if(!Boolean(req.session.user)) {
		res.redirect('/login')
		return
	}

	res.render('project_add', {
		user: req.session.user? req.session.user : {},
		msg: ''
	})
	return
}

exports.project_ueditor = function(req, res) {
	if(!Boolean(req.session.user)) {
		res.redirect('/login')
		return
	}

	var pro_name = req.query.pro_name? req.query.pro_name: ''

	Project.findOne({'name': pro_name}).exec(function(err, project) {
		if(err) {
			res.render('error', {
		    err_msg: '查找项目失败'+err,
		    user: {}
		  });
			return
		}
		res.render('project_ueditor', {
			user: req.session.user? req.session.user : {},
			msg: '',
			pro_name: project.name,
			pro_intro: project.intro,
			pro_more_intro: project.more_intro
		})
		return
	})

}



exports.errorPage = function(req, res) {
	res.render('error', {
		user: req.session.user? req.session.user : {},
		err_msg: '错误页面'
	})
}
