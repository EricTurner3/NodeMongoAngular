var express = require('express');
var url = require('url');
var app = express();

app.listen(80);

//The Root page
app.get('/', function (req, res) {
  res.send("Get Index");
});

//The find page
app.get('/find', function(req, res){
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query; 
  var response = 'Finding Book: <br>Author: ' + query.author + 
                  ' <br>Title: ' + query.title;
  console.log('\nQuery URL: ' + req.originalUrl);  
  console.log(response);
  res.send(response);
});

//The book page (must pass a chapter:page to the url)
app.get(/^\/book\/(\w+)\:(\w+)?$/, function(req, res){
  var response = 'Get Book: Chapter: ' + req.params[0] + 
              ' Page: ' + req.params[1];
  console.log('\nRegex URL: ' + req.originalUrl);
  console.log(response);
  res.send(response);
});

//The user page
app.get('/user/:userid', function (req, res) {
  var response = 'Get User: ' + req.param('userid');
  console.log('\nParam URL: ' + req.originalUrl);
  console.log(response);
  res.send(response);
});

// User ID parameter to pass to the userpage
app.param('userid', function(req, res, next, value){
  console.log("\nRequest received with userid: " + value);
  next();
});

//    Examples of paramaters for the pages:
//    /find?author=Brad&title=Node
//    /book/12:15
//    /user/4983