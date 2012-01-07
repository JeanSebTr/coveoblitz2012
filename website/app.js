// load first for a cute CLI :)
var color   = require('./libs/colors.js');

/**
 * Module dependencies.
 */
console.time('Loading dependencies'.blue);

var fs = require('fs'),
  path = require('path'),
  less = require('less');
var express = require('express');
var app = module.exports = express.createServer();

console.timeEnd('Loading dependencies'.blue);

/**
 * Compile Less CSS
 */
console.log('Compiling Less CSS...'.blue);
var dir = __dirname+'/public/stylesheets/',
  files = fs.readdirSync(dir);
var f, lcss;
for(f in files)
{
  if(path.extname(files[f]) == '.less')
  {
    lcss = fs.readFileSync(dir+files[f], 'utf8');
    less.render(lcss, function(e, css)
    {
      fs.writeFileSync(dir+path.basename(files[f], '.less')+'.css', css, 'utf8');
      console.log(' - Compiled : '.cyan+(dir+path.basename(files[f])).green)
    });
  }
}

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
