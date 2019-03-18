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
  //Find all words that start with grat...
  Words.find({word:/grat.*/}, function(err, docs){
    //Display those words to the console
    console.log("Before delete: ");
    for (var i in docs){
      console.log(docs[i].word);
    }
    //Remove words from the DB that start with grati...
    var query = Words.remove();
    query.where('word').regex(/grati.*/);
    query.exec(function(err, results){
      //Display the result of the deletion
      console.log("\n%d Documents Deleted.", results);
      //Try to find all words starting with grat... again to verify deletion
      Words.find({word:/grat.*/}, function(err, docs){
        //Print out words (should return null)
        console.log("\nAfter delete: ");
        for (var i in docs){
          console.log(docs[i].word);
        }
        //Close connection
        mongoose.disconnect();
      });
    });
  });
});