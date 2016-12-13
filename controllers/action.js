var User = require('../models').User
var SubPage = require('../models').SubPage
var Project = require('../models').Project
var crypto = require('crypto')
var fs = require('fs')
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
			res.render('error', {
		    err_msg: '查找用户失败'+err,
		    user: {}
		  });
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
				res.render('error', {
			    err_msg: '保存新用户失败'+err,
			    user: {}
			  });
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
			res.render('error', {
		    err_msg: '查找用户失败'+err,
		    user: {}
		  });
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
	if(!Boolean(req.session.user)) {
		res.render('error', {
			user: req.session.user? req.session.user : {},
			err_msg: '登录过期，请重新登录'
		})
		return
	}

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
		if(err) {
			res.render('error', {
		    err_msg: '查找用户失败'+err,
		    user: {}
		  });
			return
		}
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
			if(err) {
				res.render('error', {
			    err_msg: '更新用户失败'+err,
			    user: {}
			  });
			  return
			}			
			res.render('account', {
				user: req.session.user? req.session.user : {username: ''},
				account_msg: '修改成功'
			})
			return
		})
	})
}

exports.updateSubPageContent = function(req, res) {
	if(!Boolean(req.session.user)) {
		res.render('error', {
			user: req.session.user? req.session.user : {},
			err_msg: '登录过期，请重新登录'
		})
		return
	}

	var current_page = req.body.current_page
	var content = req.body.content
	console.log(content)
	
	SubPage.findOne({'title': current_page}).exec(function(err, subpage) {
		// 却少错误处理
		if(err) {
			res.render('error', {
		    err_msg: '查找子页面失败'+err,
		    user: {}
		  });
			return
		}
		if(Boolean(subpage)) {
			subpage.content = content
			SubPage.update({'title': subpage.title}, subpage).exec(function(err) {
				if(err) {
					res.render('error', {
				    err_msg: '更新子页面失败'+err,
				    user: {}
				  });
					return
				}
				SubPage.findOne({'title': current_page}).exec(function(err, the_sub) {
					if(err) {
						res.render('error', {
					    err_msg: '查找子页面失败'+err,
					    user: {}
					  });
						return
					}
					res.render('subpage_ueditor', {
						user: req.session.user? req.session.user : {username: ''},
						subPage: the_sub,
						msg: '修改成功'
					})
				return
				})
			})
			return
		}
		else {
			var subPage = new SubPage()
			subPage.title = current_page
			subPage.content = content
			subPage.save(function(err) {
				if(err) {
					res.render('error', {
				    err_msg: '保存子页面失败'+err,
				    user: {}
				  });
					return
				}
				res.render('subpage_ueditor', {
					user: req.session.user? req.session.user : {username: ''},
					subPage: subPage,
					msg: '修改成功'
				})
			})
		}
	})
}

exports.del_subpage = function(req, res) {
	if(!Boolean(req.session.user)) {
		res.render('error', {
			user: req.session.user? req.session.user : {},
			err_msg: '登录过期，请重新登录'
		})
		return
	}

	var _id = req.query._id
	SubPage.remove({'_id': _id}).exec(function(err, subject) {
		if(err ) {
			res.render('error', {
		    err_msg: '删除子页面失败'+err,
		    user: {}
		  });
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
	})
}

exports.add_project = function(req, res) {
	if(!Boolean(req.session.user)) {
		res.render('error', {
			user: req.session.user? req.session.user : {},
			err_msg: '登录过期，请重新登录'
		})
		return
	}
	
	var name = req.body.name
	var intro = req.body.intro
	var more_intro = req.body.more_intro

	var file_obj = req.files.pics;
  var file_obj2 = [];
  var pics = '';
  for(var i=0;i<file_obj.length;i++){
      if(file_obj[i].name){
          file_obj2.push(file_obj[i]);
      }
  }
  //图片路径们
  var imgs = [];
  var length = file_obj2.length;
  if(length == 0) {
  	// console.log(name)
  	return res.render('project_add', {
			user: req.session.user? req.session.user : {},
			msg: '图片不能为空，上传失败',
			pro_name: name,
			pro_intro: intro
		})
  }
  var uploadStatus = false;
  if(length>0){
    file_obj2.forEach(function(item,index){
      if(item.path) {
	      var tmpPath = item.path;
	      var type = item.type;
	      var extension_name = "";
	      //移动到指定的目录，一般放到public的images文件下面
	      //在移动的时候确定路径已经存在，否则会报错
	      var tmp_name = (Date.parse(new Date())/1000);
	      tmp_name = tmp_name+''+(Math.round(Math.random()*9999));
	      //判断文件类型
        switch (type) {
          case 'image/pjpeg':extension_name = 'jpg';
            break;
          case 'image/jpeg':extension_name = 'jpg';
            break;
          case 'image/gif':extension_name = 'gif';
            break;
          case 'image/png':extension_name = 'png';
            break;
          case 'image/x-png':extension_name = 'png';
            break;
          case 'image/bmp':extension_name = 'bmp';
            break;
        }
        var tmp_name = tmp_name+'.'+extension_name;
        var targetPath = './public/img/pro_img/' + tmp_name;
        
        // console.log(tmpPath);
        //将上传的临时文件移动到指定的目录下
        fs.rename(tmpPath, targetPath , function(err) {
          if(err){
            res.render('error', {
					    err_msg: '移动文件失败'+err,
					    user: {}
					  });
          }
          if(pics){
              pics += ','+tmp_name;
          }else{
              pics += tmp_name;
          }
          //判断是否完成
          // console.log(index);
           //删除临时文件
          fs.unlink(tmpPath, function(){
            if(err) {
              res.render('error', {
						    err_msg: '删除文件失败'+err,
						    user: {}
						  });
            }
            else{
            	var src = '/img/pro_img/' + tmp_name;
            	imgs.push(src);
            	//上传完成，保存进数据库
            	if(index+1 == length) {
            		Project.findOne({'name': name}).exec(function(err, the_pro) {
            			if(err) {
            				res.render('error', {
									    err_msg: '查找项目失败'+err,
									    user: {}
									  });
            			}
            			//数据库中不存在该项目，操作为新增
            			if(!Boolean(the_pro)) {
            				var project = new Project()
										project.name = name
										project.intro = intro
										project.more_intro = more_intro
										project.imgs = imgs
										project.save(function(err) {
											if(err) {
												res.render('error', {
											    err_msg: '保存项目失败'+err,
											    user: {}
											  });
											} 
											res.render('project_add', {
												user: req.session.user? req.session.user : {},
												msg: '上传成功',
												pro_name: name,
												pro_intro: intro,
												pro_more_intro: more_intro
											})
											return
										})
            			}
            			//数据库中存在该项目，更新
            			else {
            				the_pro.intro = intro
            				the_pro.more_intro = more_intro
            				the_pro.imgs = imgs;
            				Project.update({'name': name}, the_pro).exec(function(err) {
            					if(err) {
            						res.render('error', {
											    err_msg: '更新项目失败'+err,
											    user: {}
											  });
            					};
            					res.render('project_add', {
												user: req.session.user? req.session.user : {},
												msg: '上传成功',
												pro_name: name,
												pro_intro: intro,
												pro_more_intro: more_intro
											})
											return
            				})
            			}
            		})		
            	}
        		}
      		})
	      })
	    }
    })
  }
}

exports.upload_project = function(req, res) {
	if(!Boolean(req.session.user)) {
		res.render('error', {
			user: req.session.user? req.session.user : {},
			err_msg: '登录过期，请重新登录'
		})
		return
	}
	
	var name = req.body.name
	var intro = req.body.intro
	var more_intro = req.body.more_intro

	var file_obj = req.files.pics;
  var file_obj2 = [];
  var pics = '';
  for(var i=0;i<file_obj.length;i++){
      if(file_obj[i].name){
          file_obj2.push(file_obj[i]);
      }
  }
  //图片路径们
  var imgs = [];
  var length = file_obj2.length;
  if(length == 0) {
  	Project.findOne({'name': name}).exec(function(err, the_pro) {
			the_pro.intro = intro
	  	Project.update({'name': name}, the_pro).exec(function(err) {
				if(err) {
					res.render('error', {
				    err_msg: '更新项目失败 '+err,
				    user: {}
				  });
				  return
				};
				return res.render('project_ueditor', {
					user: req.session.user? req.session.user : {},
					msg: '修改成功',
					pro_name: name,
					pro_intro: intro,
					pro_more_intro: more_intro
				})
			})
  	})
  	
		return
  }
  else {
	  var uploadStatus = false;
	  if(length>0){
	    file_obj2.forEach(function(item,index){
	      if(item.path) {
		      var tmpPath = item.path;
		      var type = item.type;
		      var extension_name = "";
		      //移动到指定的目录，一般放到public的images文件下面
		      //在移动的时候确定路径已经存在，否则会报错
		      var tmp_name = (Date.parse(new Date())/1000);
		      tmp_name = tmp_name+''+(Math.round(Math.random()*9999));
		      //判断文件类型
	        switch (type) {
	          case 'image/pjpeg':extension_name = 'jpg';
	            break;
	          case 'image/jpeg':extension_name = 'jpg';
	            break;
	          case 'image/gif':extension_name = 'gif';
	            break;
	          case 'image/png':extension_name = 'png';
	            break;
	          case 'image/x-png':extension_name = 'png';
	            break;
	          case 'image/bmp':extension_name = 'bmp';
	            break;
	        }
	        var tmp_name = tmp_name+'.'+extension_name;
	        var targetPath = './public/img/pro_img/' + tmp_name;
	        
	        // console.log(tmpPath);
	        //将上传的临时文件移动到指定的目录下
	        fs.rename(tmpPath, targetPath , function(err) {
	          if(err){
	            res.render('error', {
						    err_msg: '移动文件失败'+err,
						    user: {}
						  });
	          }
	          if(pics){
	              pics += ','+tmp_name;
	          }else{
	              pics += tmp_name;
	          }
	          //判断是否完成
	          // console.log(index);
	           //删除临时文件
	          fs.unlink(tmpPath, function(){
	            if(err) {
	              res.render('error', {
							    err_msg: '删除文件失败'+err,
							    user: {}
							  });
	            }
	            else{
	            	var src = '/img/pro_img/' + tmp_name;
	            	imgs.push(src);
	            	//上传完成，保存进数据库
	            	if(index+1 == length) {
	            		Project.findOne({'name': name}).exec(function(err, the_pro) {
	            			if(err) {
	            				res.render('error', {
										    err_msg: '查找项目失败'+err,
										    user: {}
										  });
	            			}
	            		
	            			//数据库中存在该项目，更新
	            				the_pro.intro = intro
	            				the_pro.more_intro = more_intro
	            				the_pro.imgs = imgs

	            				Project.update({'name': name}, the_pro).exec(function(err) {
	            					if(err) {
	            						res.render('error', {
												    err_msg: '更新项目失败'+err,
												    user: {}
												  });
	            					};
	            					console.log(the_pro)
	            					res.render('project_ueditor', {
													user: req.session.user? req.session.user : {},
													msg: '修改成功',
													pro_name: name,
													pro_intro: intro,
													pro_more_intro: more_intro
												})
												return
	            				})
	            		})		
	            	}
	        		}
	      		})
		      })
		    }
	    })
	  }
	}
}

exports.del_project = function(req, res) {
	if(!Boolean(req.session.user.username)) {
		res.render('error', {
			user: req.session.user? req.session.user : {},
			err_msg: '你没有权限'
		})
		return
	}
	var name = req.query.name
	console.log(name)
	Project.findOne({'name': name}).exec(function(err, project) {
		if(err) {
			res.render('error', {
				user: req.session.user? req.session.user : {},
				err_msg: '查找项目失败'
			})
			return
		}
		if(!Boolean(project)) {
			res.render('error', {
				user: req.session.user? req.session.user : {},
				err_msg: '项目不存在'
			})
			return
		}
		Project.remove({'name': name}).exec(function(err, del_pro) {
			if(err) {
				res.render('error', {
					user: req.session.user? req.session.user : {},
					err_msg: '删除失败'
				})
				return
			}
			res.redirect('/project')
		})
	})
}