var http = require('http');

var Class = function(data, callback)
{
   this.data = {
      id: data.Id,
      name: data.Name
   };
   this.callback = callback;
   this.completeData();
};

Class.prototype = {
   completeData: function()
   {
      var $this = this;
      process.nextTick(function(){
         $this.dataFinish();
      });
   },
   dataFinish: function()
   {
      this.callback();
   }
};

module.exports = Class;

