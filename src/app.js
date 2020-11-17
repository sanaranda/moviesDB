var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride =  require('method-override'); // Para poder usar los métodos PUT y DELETE

// Variables para controladores 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var moviesRouter = require('./routes/moviesRouter'); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public'))); // ojo que si no pongo el ../ no encuentra el CSS
app.use(methodOverride('_method'))    // para usar PUT y DELETE, siempre antes de las rutas

// Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/movies', moviesRouter); // para manejar info de peliculas, todo lo que viene atras de movies....



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
