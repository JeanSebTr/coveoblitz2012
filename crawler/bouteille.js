

module.exports = function(indexer, http)
{
   var Class = function(data, callback)
   {
      this.data = {
         Id: data.Id,
         Name: data.Name,
         Info: "",
         Fields: []
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
         indexer.index(this.data);
         this.callback();
      }
   };
   return Class;
};

