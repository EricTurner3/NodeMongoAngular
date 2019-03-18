var mongoose = require('mongoose');
const username = 'dbadmin';
const password = 'g4DqPy'
const server = 'localhost:27017';
const database = 'words'
const url = 'mongodb://'+username+':'+password+'@'+server+'/'+database+'?authSource=admin';
//Connect to MongoDB
mongoose.connect(url,  {useNewUrlParser: true });
//Load the schema we created in word_schema.js
var wordSchema = require('./word_schema.js').wordSchema;
//Map the Words schema to a model
var Words = mongoose.model('Words', wordSchema);
//On connection, do this:
mongoose.connection.once('open', function(){
  var query = Words.findOne().where('word', 'unhappy');
  query.exec(function(err, doc){
    console.log("Before Delete: ");
    console.log(doc);
    doc.remove(function(err, deletedDoc){
      Words.findOne({word:'unhappy'}, function(err, doc){
        console.log("\nAfter Delete: ");
        console.log(doc);
        mongoose.disconnect();
      });
    });
  });
});