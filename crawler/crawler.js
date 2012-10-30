var HTTP = require(__dirname+'/http.js'),
    util = require('util'),
    Indexer = require(__dirname+'/indexer.js');

var team = 'B', runid = '6', token = '1';
var qryID = '?team='+team+'&run='+runid+'&token='+token;
var host = 'blitz01', ip = host;

var maxHttp = new HTTP(8);

var oIndex = new Indexer(ip, host, team);
var Vin  = require(__dirname+'/bouteille.js')(oIndex, maxHttp, host, qryID);
var start = '/blitzservice/start'+qryID;
var stop = '/blitzservice/end'+qryID;

var pCount = 0, inc = 200, allDone = false;
var vinCpt = 0;

var errorEvent = function(e)
   {
      console.log('problem with request: ' + e.message);
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
            maxHttp.get(opts, function(st, data)
            {
               util.log('stop crawling ! :D');
               setTimeout(function(){
                  oIndex.commit();
                  }, 2000);
               console.log(' >>> Commiting index IN 2 secondes ! ;)');
            });
         }
         else
         {
            console.log('Next page : '+(++pCount));
            callPage();
         }
      }
   };
var endEvent = function(page, res)
   {
      console.log('Page '+pCount+' received!');
      var data = JSON.parse(res);
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

var callPage = function()
{
   var options = {
      host: ip,
      port: 8123,
      path: '/bottleservice/bottles/page/'+pCount+'/count/'+inc+qryID
   };
   console.log(options);
   maxHttp.get(options, function(st, data)
   {
      console.log(st);
      endEvent(pCount, data);
   });
};

var optQry = {
   host: ip,
   port: 8123,
   path: start
};
console.log(optQry);
maxHttp.get(optQry, function(data)
{
   console.log(' >>> Start cmd result : '+data);
   util.log('start crawling ! :)');
   callPage();
});








