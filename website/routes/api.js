var querystring = require('querystring')
  , http        = require('http');


var indexsvr     = '192.168.1.11'
  , indexsvrport = 8124
  , team         = 'B';

module.exports = function(app, engine, io){
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


   app.get('/api/filters/', function (req, res) {
      res.json([{name:'pays', values:['US', 'France']}, {name:'other', values:['TEst', 'test']}]);
   });


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


   app.get('/api/suggests/:suggest', function (req, res) {
       var suggest = req.params.suggest;
   });
};
