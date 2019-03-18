var express = require('express');
var url = require('url');
var app = express();
app.listen(80);

//On the image path, send the image file to the view
app.get('/image', function (req, res) {
  //The image is located in the /views/ folder so we have to specify that in the root
  //res.sendfile is deprecacted, use res.sendFile instead
  res.sendFile('arch.jpg', 
               { maxAge: 24*60*60*1000,
                 root: './views/'},
               function(err){
    if (err){
      console.log("Error");
    } else {
      console.log("Success");
    }
  });
});