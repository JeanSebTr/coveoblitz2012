var http = require('http'),
    util = require('util');
    Vin  = require(__dirname+'/bouteille.js');

var team = 'B', runid = '2', token = '1';
var qryID = '?team='+team+'&run='+runid+'&token='+token;
var ip = '192.168.1.11';

var start = '/blitzservice/start'+qryID;
var stop = '/blitzservice/end'+qryID;

var pCount = 0, inc = 200, allDone = false;
var queries = [],
    vinCpt = 0;

var errorEvent = function(e)
   {
      console.log('problem with request: ' + e.message);
   };

var dataEvent = function(page, chunk)
   {
      if(queries[page] === undefined)
         queries[page] = '';
      queries[page] += chunk;
   };
var endVin = function()
   {
      vinCpt--;
      
      if(vinCpt <= 0)
      {
         if(allDone)
         {
            console.log('Terminé le crawling !!!');
            var opts = {
               host: ip,
               port: 8123,
               path: stop
            };
            console.log(opts);
            http.get(opts, function()
            {
               util.log('stop crawling ! :D');
            }).on('error', errorEvent);
         }
         else
         {
            console.log('Next page : '+(++pCount));
            callPage();
         }
      }
   };
var endEvent = function(page)
   {
      console.log('Page '+pCount+' received!');
      var data = JSON.parse(queries[page]);
      delete queries[page];
      if(Array.isArray(data))
      {
         if(data.length === 0)
         {
            allDone = true;
            endVin();
         }
         var i, v;
         for(i in data)
         {
            vinCpt++;
            v = new Vin(data[i], endVin);
         }
      }
      else
         console.log('Error crawling : /bottleservice/bottles/page/'+page+'/count/'+inc);
   };
var callback = function(res)
   {
      /*console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));*/
      res.setEncoding('utf8');
      res.on('data', function(chunk){
         dataEvent(pCount, chunk);
      });
      res.on('end', function(){
         endEvent(pCount);
      });
   };

var callPage = function()
{
   var options = {
      host: ip,
      port: 8123,
      path: '/bottleservice/bottles/page/'+pCount+'/count/'+inc+qryID
   };
   console.log(options);
   http.get(options, callback).on('error', errorEvent);
};

var optQry = {
   host: ip,
   port: 8123,
   path: start
};
console.log(optQry);
http.get(optQry, function(res)
{
   var data = '';
   res.on('data', function(chunk)
   {
      data += chunk;
   });
   res.on('end', function()
   {
      console.log(' >>> Start cmd result : '+data);
      util.log('start crawling ! :)');
      callPage();
   });
}).on('error', errorEvent);








