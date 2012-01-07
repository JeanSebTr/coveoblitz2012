/*
 * GET home page.
 */

module.exports = function(app){
    app.get('/', function(req, res){
        res.render('index.html', { title : 'Home page with an incredible title'});
    });

    app.get('/test', function(req,res){
        var jsonStr = '{"title": "Un titre"}';
        var json = JSON.parse(jsonStr);
        res.send(json.title);
    });
};
