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
      var opt = this.getOpts('/Index');
      http.post(opt, d, function(st, data)
      {
         
      });
   },
   commit: function()
   {
      var $this = this;
      http.get(this.getOpts('/Index/Commit'), function(st, data)
      {
         console.log(' Indexed data on '+$this.host+' : '+data);
      });
   }
};

module.exports = Class;

