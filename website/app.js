// load first for a cute CLI :)
var color   = require('./libs/colors.js');

/**
 * Module dependencies.
 */
console.time('Loading dependencies'.blue);

var fs = require('fs'),
  path = require('path');
var express = require('express');
var app = module.exports = express.createServer();

console.timeEnd('Loading dependencies'.blue);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.register('.html', require('ejs'));
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

//Routing client
require('./routes/default.js')(app);
require('./routes/api.js')(app);

app.listen(3000);
console.log("Express server listening on port %s in %s mode", (app.address().port+'').green, app.settings.env.green);
