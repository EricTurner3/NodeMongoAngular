var util = require('util');
var MongoClient = require('mongodb').MongoClient;
var gClient; // Setting the scope here so the function pagedResults can still close the client connection
const url = 'mongodb://dbadmin:g4DqPy@localhost:27017';

//MongoClient now returns a client not a DB like the book specifies
MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
  gClient = client; // Set to global scope
  var myDB = client.db("words"); // Choose the DB we will be using
  myDB.collection("word_stats", function(err, collection){
    pagedResults(err, collection, 0, 10);
  });
});

//Function to format the output to the console
function displayWords(msg, cursor, pretty){
  //Take the words and add them to an array
  cursor.toArray(function(err, itemArr){
    console.log("\n"+msg);
    var wordList = [];
    for(var i=0; i<itemArr.length; i++){
      wordList.push(itemArr[i].word);
    }
    //Print the array to the console.
    console.log(JSON.stringify(wordList, null, pretty));
  });
}

//Paginate the results
//Parameters: err - for handling errors that are thrown (unused to hide errors)
//            words - the collection we are using from the DB
//            startIndex - the index of the results we should start of for the page
//            pageSize - how many documents should return on each 'page'
function pagedResults(err, words, startIndex, pageSize){
// We pass the pageSize and startIndex to the query to prevent duplicate documents from being grabbed from the collection
// Also ensure we sort all the data so the order remains the same as we go through the pages
  words.find({first:'v'}, {limit:pageSize, skip:startIndex, sort:[['word',1]]}, function(err, cursor){
    //We need a count of the total results in the list for iterating through
    cursor.count(true, function(err, cursorCount){
      //Print out the words to the console
      displayWords("Page Starting at " + startIndex, cursor);
      //If there are enough in the cursor for a page size, then recall this function to grab the next page
      if (cursorCount === pageSize){
        //Increment the startIndex to the pageSize so we don't re-grab any results from the current page
        pagedResults(err, words, startIndex+pageSize, pageSize);
      } else {
        gClient.close();
      }
    });
  });
}
