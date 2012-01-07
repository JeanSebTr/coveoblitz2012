var querystring = require('querystring')
  , http        = require('http');


var indexsvr     = 'blitz02'
  , indexsvrport = 8124
  , team         = 'B';


var suggestHost = '127.0.0.1'
  , suggestPort =  8125;

 var jsHttp = require(__dirname + '/../../crawler/http.js');
 var jsHttpInstance = new jsHttp(0);

module.exports = function(app, engine, io){


   /**
    *
    */
   app.get('/api/search', function(req, res){
      var params = req.query;

      var query   = params.query   || ''
        , limit   = params.limit   || 20
        , offset  = params.offset  || 0
        , filters = params.filters || []
        , orderby = params.orderby || null;

       var data = JSON.stringify({ Expression  : query
                                        , FirstResult : offset
                                        , NbResults   : parseInt(limit)
                                        , Filters     : []
                                        });
      var options = {
         host: indexsvr,
         port: indexsvrport,
         path: '/Search?Team=' + team,
         method: 'POST'
      };
      console.log(options);
      console.log(data);
      jsHttpInstance.post(options, data, function(status, d){
        console.log(d);
        res.json(JSON.parse(d));
      });
   });


   app.get('/api/nine/', function (req, res) {
      res.redirect('/api/search?query=blanc&limit=9');
   });


   /**
    *
    */
   app.get('/api/filters/', function (req, res) {
      res.json([{name:'pays', values:['Canada', 'Etats-Unis', 'France', 'Italie', 'Portugal']}, {name:'Couleur', values:['rouge', 'blanc', 'rose']}]);
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
         , max     = req.query['nb']    || 100000;

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
