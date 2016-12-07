var express = require('express');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var action = require('../controllers/action.js')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', action.signup)//注册
router.post('/login', action.login)//登录
router.get('/loginout', action.loginout)//登出
router.post('/changePassword', action.changePassword)//修改密码
router.post('/updateSubPageContent', action.updateSubPageContent)//
router.get('/del_subpage', action.del_subpage)//删除子页面
router.post('/upload_project', multipartMiddleware, action.upload_project)//
router.post('/add_project', multipartMiddleware, action.add_project)//
router.get('/del_project', action.del_project)
module.exports = router;
