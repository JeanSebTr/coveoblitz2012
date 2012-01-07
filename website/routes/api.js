var querystring = require('querystring')
  , http        = require('http');


var indexsvr     = '192.168.1.11'
  , indexsvrport = 8124
  , team         = 'B';


var suggestHost = '127.0.0.1'
  , suggestPort =  8125;

module.exports = function(app, engine, io){


   /**
    *
    */
   app.get('/api/search', function(req, res){
      var params = req.query;

      var query   = params.query   || ''
        , limit   = params.limit   || 20
        , offset  = params.offset  || 0
        , filters = params.filters || {}
        , orderby = params.orderby || null;

       var data = querystring.stringify({ Expression  : query
                                        , FirstResult : offset
                                        , NbResults   : limit
                                        , Filters     : [{  }]
                                        });
      var options = {
         host: indexsvr,
         port: indexsvrport,
         path: '/Search?Team=' + team,
         method: 'POST'
      };
      var post = http.request(options, function(r) {
         r.setEncoding('utf8');
         r.on('data', function (chunk) {
            res.json({
               'success': true,
               'result': chunk
            }, 200);
         });
      });
      post.write(data);
      post.end();
   });


   /**
    *
    */
   app.get('/api/filters/', function (req, res) {
      res.json([{name:'pays', values:['US', 'France']}, {name:'other', values:['TEst', 'test']}]);
   });


   /**
    *
    */
   app.get('/api/details/:id', function (req, res) {
       var id = req.params.id;

       var data = querystring.stringify({ Expression  : '*'
                                        , FirstResult : 0
                                        , NbResults   : 1
                                        , Filters     : [{  }]
                                        });
      var options = {
         host: indexsvr,
         port: indexsvrport,
         path: '/Search?Team=' + team,
         method: 'POST'
      };
      var post = http.request(options, function(r) {
         r.setEncoding('utf8');
         r.on('data', function (chunk) {
            res.json({
               'success': true,
               'result': chunk
            }, 200);
         });
      });
      post.write(data);
      post.end();
   });


   /**
    *
    */
   app.get('/api/suggest', function (req, res) {
       var suggest = req.query['query'] || ''
         , max     = req.query['nb']    || 10;

       var options = { host: suggestHost
                     , port: suggestPort
                     , path: '/Suggest?Query='+suggest+'&MaxNb='+max
                     };
       http.get(options, function (r) {
          var tmp = '';
          r.on('data', function (data) {
             tmp += data;
          })
          r.on('end', function () {
             res.json(JSON.parse(tmp));
          });
       });
   });
};
