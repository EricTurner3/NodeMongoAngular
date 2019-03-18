//Prerequisites
var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var app = express();

//options for the HTTPS server (location of the SSL certificates)
var options = {
    host: '127.0.0.1',
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt')
  };
//Create a standard HTTP Server on port 80
http.createServer(app).listen(80);
//Create a HTTPS Server on port 443 with the SSL certs
https.createServer(options, app).listen(443);

//Once the root webpage is loaded (http://localhost/), return the following HTML:
app.get('/', function(req, res){
  //This is the HTML that will be displayed on the page once a client is connected
  res.send('Hello from Express <br><a href="/login">Login</a>');
});


//I added this (not in the book example) just to mess with passing links and having two pages to navigate between
//This is what gets displayed if you go to the login page
app.get('/login', function(req, res){
  //This is the HTML that will be displayed on the page once a client is connected
  res.send('<h1>Login Page</h1><hr><br>Username<input/><br>Password <input/> <br><a href="/">&lt;Back</a>');
});