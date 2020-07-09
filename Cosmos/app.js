var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
const helmet = require('helmet')
var favicon = require('serve-favicon');
var i18next = require('i18next'),	//i18next
    i18nextFsBackend = require('i18next-node-fs-backend'),      //i18next server 
    i18nextSprintf = require('i18next-sprintf-postprocessor'),  //i18next print error
    i18nextMiddleware = require('i18next-express-middleware');  //i18next language detector
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('cosmos'));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: false,
  //outputStyle: 'compressed',
  //prefix:  '/prefix'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/images/', 'favicon.ico')))

// i18next settings
i18next
  .use(i18nextMiddleware.LanguageDetector)
  .use(i18nextFsBackend)
  .use(i18nextSprintf)
  .init({ 
    fallbackLng: "en",	// backup languag, use this when get language error
    backend: { 
      //loadPath: "public/locales/{{lng}}/translation.json"
      loadPath: path.join(__dirname, 'public/locales/{{lng}}/translation.json'),
    },
    debug: false,
    preload: ['en','zh'],
    load: 'languageOnly',
    detection: {
      order: ['cookie'],
      lookupCookie: 'lang',
      caches: ['cookie']
    }
  });
app.use(i18nextMiddleware.handle(i18next, { removeLngFromUrl: false })); // expose req.t with fixed lng
app.post('/public/locales/add/:lng/:ns', i18nextMiddleware.missingKeyHandler(i18next)); // serves missing key route for consumers (browser)
app.get('/public/locales/resources.json', i18nextMiddleware.getResourcesHandler(i18next)); // serves resources for consumers (browser)

app.use(function (req, res, next) {
  res.locals.lang = req.cookies['lang'];
	next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

//prevent node.js from crashing
process.on('uncaughtException', function (err) {
  console.error(err);
  console.log(err.stack);
  //logger.error(err + "," + err.stack);
});

module.exports = app;
