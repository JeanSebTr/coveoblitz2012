
var http = require('http');

var Class = function(max)
{
   this.cpt = 0;
   this.max = max;
   this.stack = [];
};

Class.prototype = {
   get: function(opt, callback)
   {
      if(this.max == 0 || this.cpt < this.max)
      {
         this.cpt++;
         this.doGet(opt, callback);
      }
      else
      {
         var $this = this;
         this.stack.push(function()
         {
            $this.doGet(opt, callback);
         });
      }
   },
   doGet: function(opt, callback)
   {
      $this = this;
      http.get(opt, function(res)
      {
         var data = '';
         res.on('data', function(chunk)
         {
            data += chunk;
         });
         res.on('end', function()
         {
            $this.next();
            callback(res.statusCode, data);
         });
      });
   },
   post: function(opt, data, callback)
   {
      if(this.max == 0 || this.cpt < this.max)
      {
         this.cpt++;
         this.doPost(opt, data, callback);
      }
      else
      {
         var $this = this;
         this.stack.push(function()
         {
            $this.doPost(opt, data, callback);
         });
      }
   },
   doPost: function(opt, data, callback)
   {
      opt.method = 'POST';
      var $this = this;
      var req = http.request(opt, function(res) {
         var data = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk)
        {
            data += chunk;
        });
        res.on('end', function ()
        {
           $this.next();
           callback(res.statusCode, data);
        });
      });
      req.write(data);
      req.end();
   },
   next: function()
   {
      var req;
      if((req = this.stack.pop()) !== undefined)
      {
         req();
      }
      else
         this.cpt--;
   }
};

module.exports = Class;




