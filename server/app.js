const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const voterRouter = require('./routes/voter');
const organizerRouter = require('./routes/organizer');
const fakevoteRouter = require('./routes/fakevote');
const authRouter = require('./routes/auth');

const isAuth = require('./utilities/middleware/authJwt').verifyToken;
const {
  initRoleDatebase,
  initCodeDatabase /* , dropCodeDatabase*/,
  dropCodeDatabase,
} = require('./utilities/database');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
);
app.locals.welcome = {description: 'Looking good'};
app.locals.dbsave = false;
app.locals.token = crypto.randomBytes(64).toString('hex');
app.locals.shares = new Set();
app.locals.numbers = [1, 100, 10000, 1000000];
app.locals.maxvote = 99;
app.locals.shamir = 3;
app.use(function(req, res, next) {
  res.header(
      'Access-Control-Allow-Headers',
      'Authorization, Origin, Content-Type, Accept',
  );
  next();
});
app.use(isAuth);

// eslint-disable-next-line no-unused-vars
const mongoDB =
  'mongodb+srv://server:4HyymKiNqmP3yDR@cluster0.orhvk.mongodb.net/SvoteBase?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

app.locals.db = require('./models');

app.locals.db.mongoose
    .connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Successfully connected to MongoDB.');
      initRoleDatebase();
      // dropCodeDatabase();
    }).then(() => {
      initCodeDatabase();
      // dropCodeDatabase();
    })
    .catch((err) => {
      console.error('Connection error', err);
      process.exit();
    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/voter', voterRouter);
app.use('/organizer', organizerRouter);
app.use('/fakevote', fakevoteRouter);
app.use('/api/auth', authRouter);

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
