const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const crypto = require('crypto');

const indexRouter = require('./routes/index');
const voterRouter = require('./routes/voter');
const organizerRouter = require('./routes/organizer');
const fakevoteRouter = require('./routes/fakevote');

const app = express();

app.locals.database = {description: 'Looking good'};
app.locals.token = crypto.randomBytes(64).toString('hex');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/voter', voterRouter);
app.use('/organizer', organizerRouter);
app.use('/fakevote', fakevoteRouter);

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
