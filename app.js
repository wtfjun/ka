var express = require('express');
var path = require('path');
var show = require('./routes/show');
var action = require('./routes/action');
var api = require('./routes/api');

var app = express();
//配置session，使用connect－mongo
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('./config.js');
const mongoose = require('mongoose');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ueditor = require("ueditor")
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json());

app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
  var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = '/img/ueditor/';//默认上传地址为图片
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/file/ueditor/'; //附件保存地址
        }
        if (ActionType === 'uploadvideo') {
            file_url = '/video/ueditor/'; //视频保存地址
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
  //客户端发起图片列表请求
  else if (ActionType === 'listimage'){
    var dir_url = '/images/ueditor/';
    res.ue_list(dir_url);  // 客户端会列出 dir_url 目录下的所有图片
  }
  // 客户端发起其它请求
  else {
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/ueditor/nodejs/config.json')
}}));

//连接mongodb数据库
const connection = mongoose.createConnection(config.host + config.db);
//开启session，将cookie保存在数据库
app.use(session({
  //每当生成一个cookie对象，都会随机生成一个cookies.secret作为唯一token
  secret: config.cookieSecret,
  // key: 'auth_token',
  //30天
  cookie:{maxAge:1000*60*60*24*30},
  store:new MongoStore({mongooseConnection: connection}),
  resave: false,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html'); 
app.engine('html', require('ejs-mate')); 
app.locals._layoutFile = 'layout.html'; 

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', show);
app.use('/action', action);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
