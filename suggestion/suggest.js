var fs          = require('fs')
  , http        = require('http')
  , querystring = require('querystring');
var express = require('express');
var app = module.exports = express.createServer();

var filename = 'vino.txt';

var words = {};
var test = [];

fs.readFile(filename, function (err, res) {
   var data = res.toString();
   var json = JSON.parse(data);
   for (var i=0; i<json.length; i++) {
      var line = json[i];
      var reg = /\b(\w+)\b/gi;
      while (res = reg.exec(line)) {
         var word = res[1].toLowerCase();
         if (word.length <= 3) { continue; }
         words[word] = 0;
      }
   }
   for (word in words) {
      test.push(word);
   }
   test.sort();
   console.log(test);
});


app.configure(function(){
  app.set('views', __dirname + '/views');
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

app.get('/Suggest', function (req, res) {
   var params = req.query;
   var query = params.Query || ''
     , MaxNb = params.MaxNb || 10;
   var arr = query.toLowerCase().split(' ');
   query = arr[arr.length - 1];
   var tmp = [];

   var l = {};
   for (var i=0; i<test.length; i++) {
      var word = test[i];
      if (word.length <= query.length) { continue; }
      var distance = levenshtein(query, word);
      l[word] = distance;
   }


   var tuples = [];
   for (var key in l) { tuples.push([key, l[key]]); }
   tuples.sort(function(a, b) {
       a = a[1];
       b = b[1];
       return a < b ? -1 : (a > b ? 1 : 0);
   });


   for (var i=0; i<tuples.length; i++) {
      var word = tuples[i][0];
      if (query == '' && word.length < 5) { continue; }
      tmp.push(word);
      if (tmp.length >= MaxNb) { break; }
   }
   tmp.sort();
   res.json(tmp);
})

app.listen(8125);

function levenshtein (s1, s2) {
   if (s1 == s2) { return 0; }
   var s1Len = s1.length;
   var s2Len = s2.length;
   if (s1.length === 0) { return s2.length; }
   if (s2.length === 0) { return s1.length; }
   var v0 = [s1.length + 1];
   var v1 = [s1.length + 1];
   var s1Idx = 0
     , s2Idx = 0
     , cost  = 0;
   for (var s1Idx = 0; s1Idx < s1.length + 1; s1Idx++) {
      v0[s1Idx] = s1Idx;
   }
   var charS1 = ''
     , charS2 = '';
   for (var s2Idx = 1; s2Idx <= s2.length; s2Idx++) {
      v1[0] = s2Idx;
      charS2 = s2[s2Idx - 1];
      for (var s1Idx = 0; s1Idx < s1.length; s1Idx++) {
         charS1 = s1[s1Idx];
         cost = (charS1 == charS2) ? 0 : 1;
         var mMin = v0[s1Idx + 1] + 1;
         var b = v1[s1Idx] + 1;
         var c = v0[s1Idx] + cost;
         if (b < mMin) { mMin = b; }
         if (c < mMin) { mMin = c; }
         v1[s1Idx + 1] = mMin;
      }
      var tmp = v0;
      v0 = v1;
      v1 = tmp;
   }
   return v0[s1.length];
}
