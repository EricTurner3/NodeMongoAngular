var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://dbadmin:g4DqPy@localhost:27017';

//MongoClient now returns a client not a DB like the book specifies
MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
  var myDB = client.db("words"); // Choose the DB we will be using
  myDB.collection("word_stats", groupItems); //Grab the collection (like a SQL Table) and execute the following function with it
  setTimeout(function(){client.close();}, 3000); //Pause to allow completion of the callbacks
});

//Group words together
//MongoDB 3.6+ no longer supports the group command
//I had to refactor this method entirely using the new aggregation framework (see doc_group_refactored.js)

//Original Book Source (it still is at least outputting now on 12 Mar 2019 using Mongo v3.1.13 since the deprecation occurs at v3.6+): 
function groupItems(err, words){
  words.group(['first','last'], 
              {first:'o',last:{$in:['a','e','i','o','u']}},
              {"count":0}, 
              function (obj, prev) { prev.count++; }, true,
              function(err, results){
        console.log("\n'O' words grouped by first and last" +
                    " letter that end with a vowel: ");
        console.log(results);
  });

  
  words.group(['first'],
              {size:{$gt:13}},
              {"count":0, "totalVowels":0},
              function (obj, prev) { 
                prev.count++; prev.totalVowels += obj.stats.vowels;
              }, {}, true, 
              function(err, results){
    console.log("\nWords grouped by first letter larger than 13: ");
    console.log(results);
  });


  words.group(['first'],{}, {"count":0, "vowels":0, "consonants":0}, 
              function (obj, prev) { 
                prev.count++;
                prev.vowels += obj.stats.vowels;
                prev.consonants += obj.stats.consonants;
              },function(obj){
                obj.total = obj.vowels + obj.consonants;
              }, true, 
              function(err, results){
        console.log("\nWords grouped by first letter with totals: ");
        console.log(results);
  });
}
