//This is not an example in the book. I created this for practice in using the find methods
//After running mongoose_create.js, this file is just performing a find on the words I just created to ensure
//they are in the database
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
    //Now a new query: find all words
    var query = Words.find();
    //Where the word is one of the following
    query.where('word').in(['gratifaction', 'googled', 'selfie']);
    //Execute the query
    query.exec(function(err, results){
      console.log("\nWords created in mongoose_create.js: ");
      for (var i in results){
        console.log("\n"+  results[i].word + ": " + JSON.stringify(results[i]));
      }
    //Close the connection
    mongoose.disconnect();
    });
  });