/*
 * GET home page.
 */

module.exports = function(app, engine, io){
   app.get('/api/progress', function(req, res){
      res.json({
         'success': true,
         'result': engine.progress
      }, 200);
   });
};
