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
   console.log(json);
   for (var i=0; i<json.length; i++) {
      var line = json[i];
      var reg = /\b(\w+)\b/gi;
      while (res = reg.exec(line)) {
         var word = res[1].toLowerCase();
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
   var query = params.Query || null
     , MaxNb = params.MaxNb || 10;
   if (!query) {
      res.json([]);
   } else {
      var arr = query.toLowerCase().split(' ');
      query = arr[arr.length - 1];
      var tmp = [];
      for (var i=0; i<test.length; i++) {
         var word = test[i];
         if (query == '' && (word.substr(0, 1) != 'a' || word.length < 3)) { continue; }
         if (word.substr(0, query.length) != query) { continue; }
         tmp.push(word);
         if (tmp.length >= MaxNb) { break; }
      }
      res.json(tmp);
   }
})

app.listen(8125);


function levenshtein (s1, s2) {
    if (s1 == s2) { return 0; }
    var s1_len = s1.length;
    var s2_len = s2.length;
    if (s1_len === 0) { return s2_len; }
    if (s2_len === 0) { return s1_len; }
 
    // BEGIN STATIC
    var split = false;
    try {
        split = !('0')[0];
    } catch (e) {
        split = true; // Earlier IE may not support access by string index
    }
    // END STATIC
    if (split) {
        s1 = s1.split('');
        s2 = s2.split('');
    }
 
    var v0 = [s1_len + 1];
    var v1 = [s1_len + 1];
 
    var s1_idx = 0,
        s2_idx = 0,
        cost = 0;
    for (s1_idx = 0; s1_idx < s1_len + 1; s1_idx++) {
        v0[s1_idx] = s1_idx;
    }
    var char_s1 = '',
        char_s2 = '';
    for (s2_idx = 1; s2_idx <= s2_len; s2_idx++) {
        v1[0] = s2_idx;
        char_s2 = s2[s2_idx - 1];
 
        for (s1_idx = 0; s1_idx < s1_len; s1_idx++) {
            char_s1 = s1[s1_idx];
            cost = (char_s1 == char_s2) ? 0 : 1;
            var m_min = v0[s1_idx + 1] + 1;
            var b = v1[s1_idx] + 1;
            var c = v0[s1_idx] + cost;
            if (b < m_min) {
                m_min = b;
            }
            if (c < m_min) {
                m_min = c;
            }
            v1[s1_idx + 1] = m_min;
        }
        var v_tmp = v0;
        v0 = v1;
        v1 = v_tmp;
    }
    return v0[s1_len];
}

console.log(levenshtein('hello', 'ehlllllo'));
