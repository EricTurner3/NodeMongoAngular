var express = require('express');
var url = require('url');
var app = express();
app.listen(80);

// In the root directory
app.get('/', function (req, res) {
  //Return the following HTML
  var response = '<html><head><title>Simple Send</title></head>' +
                 '<body><h1>Hello from Express</h1></body></html>';
  //Return the following status code
  res.status(200);
  //Return the following headers
  res.set({
    'Content-Type': 'text/html',
    'Content-Length': response.length
  });
  //Return the full response
  res.send(response);
  //Log to Node.js console if the response is complete and 
  console.log('\nResponse Finished? ');
  console.log(res.finished);
  console.log('\nHeaders Sent: ');
  console.log(res.headersSent);
});

//If we go to the error page
app.get('/error', function (req, res) {
  //Return a status of 400
  res.status(400);
  //Send bad request to the view
  res.send("This is a bad request.");
  console.log('\nStatus 400: Error');
});