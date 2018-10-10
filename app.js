var multer = require('multer');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

var upload = multer({
    dest: __dirname + '/public/uploads/'
});

// ECT view engine setup
var ECT = require('ect');
var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext: '.ect'});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);

// routes setup
var routes = require('./routes/index');

app.use('/', routes);

app.post('/up', upload.single('upFile'), function (req, res, next) {

    var uploadedPath = req.file["path"];
    var destination = req.file["destination"];
    var originalname = req.file["originalname"];

    fs.rename(uploadedPath, destination + originalname, function (err) {
      if (err) {
        res.render('error', {
          message: err.message,
          error: err
        });
      } else {
        res.render('index');
      }
    });
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
