

module.exports = function(indexer, http, host, idQry)
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
      this.cpt = 0;
      var $this = this;
      
      // visuel
      http.get({
         host: host,
         port: 8123,
         path: '/sensoryservice/visual/bottle/'+data.Id+idQry
         }, function(st, res)
         {
            if(st == 200)
            {
               var data = JSON.parse(res);
               $this.data.Fields.push({
                  Name: 'BlitzField01',
                  Value: data['35']
               });
            }
            $this.completeData();
         });this.cpt++;
      // image
      http.get({
         host: host,
         port: 8123,
         path: '/imageservice/image/'+data.Id+idQry
         }, function(st, res)
         {
            if(st == 200)
            {
               var data = JSON.parse(res);
               if(data.length > 0)
               {
                  $this.data.Fields.push({
                     Name: 'BlitzField07',
                     Value: data[0]
                  });
               }
            }
            $this.completeData();
         });this.cpt++;
      // selling
      http.get({
         host: host,
         port: 8123,
         path: '/sellerservice/info/'+data.Id+idQry
         }, function(st, res)
         {
            if(st == 200)
            {
               var data = JSON.parse(res);
               if(data.Price)
               {
                  $this.data.Fields.push({
                     Name: 'BlitzField04',
                     Value: data.Price
                  });
               }
               if(data.Size)
               {
                  $this.data.Fields.push({
                     Name: 'BlitzField05',
                     Value: data.Size
                  });
               }
               if(data.ItemType)
               {
                  $this.data.Fields.push({
                     Name: 'BlitzField06',
                     Value: data.ItemType
                  });
               }
            }
            $this.completeData();
         });this.cpt++;
   };
   
   Class.prototype = {
      completeData: function()
      {
         this.cpt--;
         if(this.cpt <= 0)
            this.dataFinish();
      },
      dataFinish: function()
      {
         //console.log(this.data);
         indexer.index(this.data);
         this.callback();
      }
   };
   return Class;
};

