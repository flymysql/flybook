var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.enabled("view cache") 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('flykey'));
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 8640000}));
app.use(bodyParser.urlencoded({extended:true}));

// login
app.use(session({
  // name: identityKey,
  secret: 'flykey',  // 用来对session id相关的cookie进行签名
  store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
  saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
  resave: false,  // 是否每次都重新保存会话，建议false
  cookie: {
      maxAge: 8640000 * 1000  // 有效期，单位是毫秒
  }
}));


app.use('/', indexRouter);
app.use('/create', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
// 404 page
app.use(function (req, res) {
  if(req.url === '/favicon.ico') {
    // 忽略
  } 
  else if (!res.headersSent) {
    res.redirect(301, '/404.html');
  }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
