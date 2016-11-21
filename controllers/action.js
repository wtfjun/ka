var User = require('../models').User
var SubPage = require('../models').SubPage
var crypto = require('crypto')
var common = require('./common.js')

exports.signup = function(req, res) {
	var username = req.body.username
	var password = req.body.password
	if(username.length <= 0 || password.length <=0) {
		res.render('signup', {
			status: 'fail',
			msg: '用户名或密码不能为空'
		})
		return
	}
	if(common.containSpecial(username) || common.containSpecial(password)) {
		res.render('signup', {
			status: 'fail',
			msg: '用户名和密码不能包含特殊字符'
		})
		return
	}
	User.findOne({'username': username}).exec(function(err, user) {
		if(err) {
			res.render('signup', {
				status: 'fail',
				msg: '用户查找失败'
			})
			return
		}
		if(Boolean(user)) {
			res.render('signup', {
				status: 'fail',
				msg: '用户名已存在'
			})
			return
		}
		var new_user = new User()
		new_user.username = username
		//md5签名；签名和加密的区别为：签名不可逆，加密可逆。这里认为md5不可逆
		var md5 = crypto.createHash('md5');
		md5.update(password);
		//签名后的密码
		var md5Password = md5.digest('hex'); 
		new_user.password = md5Password
		new_user.save(function(err) {
			if(err) {
				res.render('signup', {
					status: 'fail',
					msg: '保存新用户失败'
				})
				return
			}
			res.redirect('/login')
			return
		})
	})
}

exports.login = function(req, res) {
	var username = req.body.username
	var password = req.body.password
	if(username.length <= 0 || password.length <=0) {
		res.render('login', {
			status: 'fail',
			msg: '用户名或密码不能为空'
		})
		return
	}
	if(common.containSpecial(username) || common.containSpecial(password)) {
		res.render('login', {
			status: 'fail',
			msg: '用户名和密码不能包含特殊字符'
		})
		return
	}
	User.findOne({'username': username}).exec(function(err, user) {
		if(err) {
			res.render('login', {
				status: 'fail',
				msg: '用户查找失败'
			})
			return
		}
		if(!Boolean(user)) {
			res.render('login', {
				status: 'fail',
				msg: '用户不存在，请先注册'
			})
			return
		}
		//md5签名；签名和加密的区别为：签名不可逆，加密可逆。这里认为md5不可逆
		var md5 = crypto.createHash('md5');
		md5.update(password);
		//签名后的密码
		var md5Password = md5.digest('hex'); 
		if(user.password != md5Password) {
			res.render('login', {
				status: 'fail',
				msg: '密码错误'
			})
			return
		}
		//重重把关之后到达这里已经可以登录成功了word哥
		req.session.user = user;
		res.redirect('/')
	})
}

exports.loginout = function(req, res) {
	delete req.session.user;
	res.redirect('/')
}

exports.changePassword = function(req, res) {

	var current_user = req.session.user;
	var old_password = req.body.old_password
	var new_password = req.body.new_password
	var sec_new_password = req.body.sec_new_password
	//md5签名；签名和加密的区别为：签名不可逆，加密可逆。这里认为md5不可逆
	var md5 = crypto.createHash('md5');
	md5.update(old_password);
	//签名后的密码
	var md5_old_password = md5.digest('hex');
	User.findOne({'username': current_user.username}).exec(function(err, user) {
		if(err) return console.log(err);
		if(user.password != md5_old_password) {
			res.render('account', {
				user: req.session.user? req.session.user : {username: ''},
				account_msg: '原密码不正确'
			})
			return
		}
		if(new_password != sec_new_password) {
			res.render('account', {
				user: req.session.user? req.session.user : {username: ''},
				account_msg: '两次输入的新密码不一致'
			})
			return
		}
		//md5签名；签名和加密的区别为：签名不可逆，加密可逆。这里认为md5不可逆
		var md5 = crypto.createHash('md5');
		md5.update(new_password);
		//签名后的密码
		var md5_new_password = md5.digest('hex');
		user.password = md5_new_password
		User.update({'_id': user._id}, user).exec(function(err) {
			if(err) return console.log(err)
			res.render('account', {
				user: req.session.user? req.session.user : {username: ''},
				account_msg: '修改成功'
			})
			return
		})
	})
}

exports.updateSubPageContent = function(req, res) {
	var current_page = req.body.current_page
	var content = req.body.content
	
	SubPage.findOne({'title': current_page}).exec(function(err, subpage) {
		// 却少错误处理
		if(Boolean(subpage)) {
			subpage.content = content
			SubPage.update({'title': subpage.title}, subpage).exec(function(err) {
				if(err) {
					return res.render('subpage_ueditor', {
						user: req.session.user? req.session.user : {},
						subPage: subpage,
						msg: '修改出错'
					})
				}
				res.render('subpage_ueditor', {
					user: req.session.user? req.session.user : {username: ''},
					subPage: subpage,
					msg: '修改成功'
				})
				return
			})
		}
		// else {
		// 	var subPage = new SubPage()
		// 	subPage.title = current_page
		// 	subPage.content = content
		// 	subPage.save(function(err) {
		// 		if(err) {
		// 			return res.render('subpage_ueditor', {
		// 				user: req.session.user? req.session.user : {username: ''},
		// 				subPage: subPage,
		// 				msg: '修改出错'
		// 			})
		// 		}
		// 		res.render('subpage_ueditor', {
		// 			user: req.session.user? req.session.user : {username: ''},
		// 			subPage: subPage,
		// 			msg: '修改成功'
		// 		})
		// 	})
		// }
	})
}

exports.upload_project = function(req, res) {
	console.dir(req.files);
	res.render('project_ueditor', {
				user: req.session.user? req.session.user : {},
				msg: ''
			})
			return
}