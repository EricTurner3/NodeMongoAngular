var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://dbadmin:g4DqPy@localhost:27017';
//MongoClient now returns a client not a DB like the book specifies
MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
  var myDB = client.db("words"); // Choose the DB we will be using
  myDB.collection("word_stats", limitFind); // Grab the collection (like a SQL Table) and execute the following function with it
  setTimeout(function(){client.close();}, 3000); // 3s to allow the promises to complete
});
//A function to format the cursor that is returned from the collection
function displayWords(msg, cursor, pretty){
  cursor.toArray(function(err, itemArr){
    console.log("\n"+msg);
    var wordList = [];
    for(var i=0; i<itemArr.length; i++){
      wordList.push(itemArr[i].word);
    }
    console.log(JSON.stringify(wordList, null, pretty));
  });
}
//Example of performing a count, full find, and a find that has a limit
//Comparable to SQL Server: SELECT count(*) FROM word_stats, SELECT * FROM word_stats, SELECT TOP 5 * FROM word_stats
//This is useful to limit the total amount of documents that are returned
function limitFind(err, words){
  //Books [collection].count is deprecated, so I am using [collection].countDocuments
  words.countDocuments({first:'p'}, function(err, count){
    console.log("Count of words starting with p : " + count);
  });
  words.find({first:'p'}, function(err, cursor){
    displayWords("Words starting with p : ", cursor);
  });
  words.find({first:'p'}, {limit:5}, function(err, cursor){
    displayWords("Limiting words starting with p : ", cursor);
  });
}