var express = require('express');
var url = require('url');
var app = express();
app.listen(80);

//Download a file
app.get('/download', function (req, res) {
  //This is deprecated. use res.sendFile instead
  //res.sendfile('./views/word.docx', 'new.docx');

  //New method
  res.sendFile('word.docx', 
               {root: './views/'},
               function(err){
    if (err){
      console.log("Error: " + err);
    } else {
      console.log("Success");
    }
  });
});