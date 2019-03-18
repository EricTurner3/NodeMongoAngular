var express = require('express'),
    pug = require('pug'),
    ejs = require('ejs');
var app = express();
app.set('views', './views');
app.set('view engine', 'pug');
app.engine('pug', pug.__express);
app.engine('html', ejs.renderFile);
app.listen(80);

//Variable names
app.locals.uname= 'Caleb';
app.locals.vehicle= 'TARDIS';
app.locals.terrain= 'time and space';
app.locals.location= 'anywhere anytime';
//Render the template we have setup using the pug plugin
app.get('/pug', function (req, res) {
  res.render('user_pug');
});

//Render the template we have setup using the ejs plugin
app.get('/ejs', function (req, res) {
  app.render('user_ejs.html', function(err, renderedData){
    res.send(renderedData);    
  });
});