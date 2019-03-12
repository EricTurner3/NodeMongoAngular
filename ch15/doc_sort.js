var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://dbadmin:g4DqPy@localhost:27017';
//MongoClient now returns a client not a DB like the book specifies
MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
  var myDB = client.db("words"); // Choose the DB we will be using
  myDB.collection("word_stats", sortItems); //Grab the collection (like a SQL Table) and execute the following function with it
  setTimeout(function(){client.close();}, 3000); //Pause to allow completion of the callbacks
});

//Format the results for the console
function displayWords(msg, cursor, pretty){
  //Load the words into an array
  cursor.toArray(function(err, itemArr){
    console.log("\n"+msg);
    var wordList = [];
    for(var i=0; i<itemArr.length; i++){
      wordList.push(itemArr[i].word);
    }
    //Print the array
    console.log(JSON.stringify(wordList, null, pretty));
  });
}

// Sort the items returned, similar to SELECT * FROM word_stats WHERE ... ORDER BY ...
// Use 1 to sort ascending and -1 to sort descending
function sortItems(err, words){
  //Default result list
  words.find({last:'w'}, function(err, cursor){
    displayWords("Words ending in w: ", cursor);
  });

  //Sorting by words ending in w ascending
  words.find({last:'w'}, {sort:{word:1}}, function(err, cursor){
    displayWords("Words ending in w sorted ascending: ", cursor);
  });
  //Sorting by words ending in w descending
  words.find({last:'w'}, {sort:{word:-1}}, function(err, cursor){
    displayWords("Words ending in w sorted, descending: ", cursor);
  });

  //Also can sort by multiple attributes
  words.find({first:'b'}, {sort:[['size',-1],['last',1]]}, function(err, cursor){
    displayWords("B words sorted by size then by last letter: ", cursor);
  });
  words.find({first:'b'}, {sort:[['last',1],['size',-1]]}, function(err, cursor){
    displayWords("B words sorted by last letter then by size: ", cursor);
  });
}