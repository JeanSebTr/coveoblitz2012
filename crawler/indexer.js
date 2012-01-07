var HTTP = require(__dirname+'/http.js'), http = new HTTP(10000);

var Class = function(ip, host, team)
{
   var $this = this;
   
   this.ip = ip;
   this.host = host;
   this.team = team;
   this.port = 8124;
   
   this.stack = [];
   var opt = this.getOpts('/Index/Clear');
   console.log(opt);
   http.get(opt, function(st, data)
   {
      console.log(' >>> Clear Index result : '+data);
      $this.index = $this.realIndex;
      var obj;
      while((obj = $this.stack.pop()) !== undefined)
      {
         $this.index(obj);
      }
   });
};

Class.prototype = {
   getOpts: function(path)
   {
      return {
      host: this.host,
      port: this.port,
      path: path+'?Team='+this.team
      };
   },
   index: function(obj)
   {
      this.stack.push(obj);
   },
   realIndex: function(obj)
   {
      var d = JSON.stringify(obj);
      console.log(' -- Indexing '+d);
      var opt = this.getOpts('/Index');
      http.post(opt, d, function(st, data)
      {
         console.log(" >>> "+obj.Id+" indexed : "+data);
      });
   },
   commit: function()
   {
      http.get(this.getOpts('/Index/Commit'), function(st, data)
      {
         console.log(' -- Commit result : '+data);
      });
   }
};

module.exports = Class;

