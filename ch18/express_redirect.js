var express = require('express');
var url = require('url');
var app = express();
app.listen(80);

//Redirect to google
app.get('/google', function (req, res) {
  console.log("Loaded /google -> Redirecting to http://google.com");
  res.redirect('http://google.com');
});
//Redirect to /second
app.get('/first', function (req, res) {
  console.log("Loaded /first -> Redirecting to /second");
  res.redirect('/second');
});


app.get('/second', function (req, res) {
  console.log("Loaded /second");
  res.send("Response from Second");
});

//Redirect to up one level to /B
app.get('/level/A', function (req, res) {
  console.log("Loaded /level/A -> Redirecting to /level/B");
  res.redirect("/B");
});
app.get('/level/B', function (req, res) {
  console.log("Loaded /level/B");
  res.send("Response from Level B");
});