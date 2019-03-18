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
//After 3 seconds, end the connection automatically
setTimeout(function(){mongoose.disconnect();}, 3000);

//On connection, do this:
mongoose.connection.once('open', function(){
  //Build the query to find all words that start and end with a vowel
  //count() is deprecated, changed to estimatedDocumentCount()
  var query = Words.estimatedDocumentCount({}).where('first').in(['a', 'e', 'i', 'o', 'u']);
  query.where('last').in(['a', 'e', 'i', 'o', 'u']);
  //Here is where we execute the query and return the count
  query.exec(function(err, count){
    //The book does not specify this since count is deprecated, 
    //but count returns the array with all the documents
    //adding .length returns the actual count
    console.log("\nThere are " + count.length + " words that start and end with a vowel");
  });
  //We can still modify the query we already created such as limiting and sorting the results
  query.find().limit(5).sort({size:-1});
  //And then re-execute and display the results
  query.exec(function(err, results){
    console.log("\nLongest 5 words that start and end with a vowel: ");
    for (var i in results){
      console.log(results[i].word);
    }
  });

  //Now a new query: find all words
  query = Words.find();
  //With even lengths
  query.mod('size',2,0);
  //Longer than 5 letters
  query.where('size').gt(6);
  //Only grab the first 10
  query.limit(10);
  //??
  query.select({word:1, size:1});
  //Execute the query and return the results
  query.exec(function(err, results){
    console.log("\nWords with even lengths and longer than 5 letters: ");
    for (var i in results){
      console.log(JSON.stringify(results[i]));
    }
  });
});