var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv=require('dotenv').config()
var dbConnection=require('./config/dbConnect')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/authRouter');
var productRouter = require('./routes/productRouter');
var blogRouter = require('./routes/blogRouter');
var prodCategoryRouter = require('./routes/prodCatRouter');
var blogCategoryRouter = require('./routes/blogCatRoute');
var brandRouter = require('./routes/brandRouter');
var coupenRouter = require('./routes/coupenRouter');
var addressRouter = require('./routes/addressRouter');
const bodyParser = require('body-parser');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
dbConnection()
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', prodCategoryRouter);
app.use('/api/blog-category', blogCategoryRouter);
app.use('/api/brand', brandRouter);
app.use('/api/coupen', coupenRouter);
app.use('/api/address', addressRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
