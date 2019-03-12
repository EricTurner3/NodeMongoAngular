var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://dbadmin:g4DqPy@localhost:27017';

//MongoClient now returns a client not a DB like the book specifies
MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
  var myDB = client.db("words"); // Choose the DB we will be using
  myDB.collection("word_stats", distinctValues); //Grab the collection (like a SQL Table) and execute the following function with it
  setTimeout(function(){client.close();}, 3000); //Pause to allow completion of the callbacks
});

//Return distinct values for a single field/attribute in a set of documents
function distinctValues(err, words){
  words.distinct('size', function(err, values){
    console.log("\nSizes of words: ");
    console.log(values);
  });
  words.distinct('first', {last:'u'}, function(err, values){
    console.log("\nFirst letters of words ending in u: ");
    console.log(values);
  });
  words.distinct('stats.vowels', function(err, values){
    console.log("\nNumbers of vowels contain in words: ");
    console.log(values);
  });
}