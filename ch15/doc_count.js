var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://dbadmin:g4DqPy@localhost:27017';
//MongoClient now returns a client not a DB like the book specifies
MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
  var myDB = client.db("words"); // Choose the DB we will be using
  myDB.collection("word_stats", countItems); // Grab the collection (like a SQL Table) and execute the following function with it
  setTimeout(function(){client.close();}, 3000); //Set a timeout of 3 seconds to give enough time for the promises to complete
});
//The book uses [collection].count which MongoClient says is deprecated.
//Can use [collection].countDocuments or [collection].estimatedDocumentCount
function countItems(err, words){
  //This one is new, without passing a first argument, we can get the total count of all documents in the collection
  words.countDocuments(function(err,count){
    console.log("Total Words in Collection: " + count);
  });
  //These methods below use the same queries as the doc_query, 
  //but instead of [collection].find we are performing a count using [collection].countDocuments
  words.countDocuments({first:{$in: ['a', 'b', 'c']}}, function(err, count){
    console.log("Words starting with a, b or c: " + count);
  });
  words.countDocuments({size:{$gt: 12}}, function(err, count){
    console.log("Words longer that 12 characters: " + count);
  });
  words.countDocuments({size:{$mod: [2,0]}}, function(err, count){
    console.log("Words with even Lengths: " + count);
  });
  words.countDocuments({letters:{$size: 12}}, function(err, count){
    console.log("Words with 12 Distinct characters: " + count);
  });
  words.countDocuments({$and: [{first:{$in: ['a', 'e', 'i', 'o', 'o']}},
                     {last:{$in: ['a', 'e', 'i', 'o', 'o']}}]}, 
             function(err, count){
    console.log("Words that start and end with a vowel: " + count);
  });
  words.countDocuments({"stats.vowels":{$gt:6}}, function(err, count){
    console.log("Words containing 7 or more vowels: " + count);
  });
  words.countDocuments({letters:{$all: ['a','e','i','o','u']}}, 
              function(err, count){
    console.log("Words with all 5 vowels: " + count);
  });
  words.countDocuments({otherChars: {$exists:true}}, function(err, count){
    console.log("Words with non-alphabet characters: " + count);
  });
  words.countDocuments({charsets:{$elemMatch:{$and:[{type:'other'},
              {chars:{$size:2}}]}}}, 
              function(err, count){
    console.log("Words with 2 non-alphabet characters: " + count);
  });
}