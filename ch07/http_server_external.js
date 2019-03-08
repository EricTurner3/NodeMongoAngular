var http = require('http');
var url = require('url');
var qstring = require('querystring');
var API_KEY = "94f38a7a1a91948b0e04e86d5d4d2ef3";

//This is the main view that shows you input box for weather and also the result from the api
function sendResponse(weatherData, res){
  var page = '<html><head><title>External Example</title></head>' +
    '<body>' +
    '<form method="post">' +
    'City: <input name="city"><br>' +
    '<input type="submit" value="Get Weather">' +
    '</form>';
  if(weatherData){
    page += '<h1>Weather Info</h1><p>' + weatherData +'</p>';
  }
  page += '</body></html>';    
  res.end(page);
}

//Parse the result from the API
function parseWeather(weatherResponse, res) {
  var weatherData = '';
  weatherResponse.on('data', function (chunk) {
    weatherData += chunk;
  });
  weatherResponse.on('end', function () {
    sendResponse(weatherData, res);
  });
}

//Call the openweathermap api to get the weather for a specified city
function getWeather(city, res){
  var options = {
    host: 'api.openweathermap.org',
    path: '/data/2.5/weather?q=' + city + '&APPID=' + API_KEY
  };
  http.request(options, function(weatherResponse){
    parseWeather(weatherResponse, res);
  }).end();
}

//Create a server at localhost 
http.createServer(function (req, res) {
  console.log(req.method);
  //Capture the POST request of submitting a city
  if (req.method == "POST"){
    var reqData = '';
    req.on('data', function (chunk) {
      reqData += chunk;
    });
    req.on('end', function() {
      var postParams = qstring.parse(reqData);
      getWeather(postParams.city, res);
    });
  } else{ //Show the info in the sendResponse method
    sendResponse(null, res);
  }
}).listen(8080);