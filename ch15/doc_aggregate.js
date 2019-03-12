var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://dbadmin:g4DqPy@localhost:27017';

//MongoClient now returns a client not a DB like the book specifies
MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
  var myDB = client.db("words"); // Choose the DB we will be using
  myDB.collection("word_stats", aggregateItems); //Grab the collection (like a SQL Table) and execute the following function with it
  setTimeout(function(){client.close();}, 3000); //Pause to allow completion of the callbacks
});

//The book puts the return function as a parameter in the aggregate function.
//As of 12 Mar 2019, this does not work when I tried it so I had to refactor the code
//So the function is part of a .toArray call after the aggregate method has completed
function aggregateItems(err, words){

//Example of the books original source code 
//(take a look of the location of the return function)
/*
words.aggregate([{$match: {first:{$in:['a','e','i','o','u']}}},
                   {$group: {_id:"$first", 
                             largest:{$max:"$size"}, 
                             smallest:{$min:"$size"}, 
                             total:{$sum:1}}},
                   {$sort: {_id:1}}],
                   //Right here, the func is a PARAMETER
                   function(err, results){
                    console.log("Largest and smallest word sizes for " +
                                "words beginning with a vowel: ");
                    console.log(results);
                  });
*/

  //Refactored code below:
  words.aggregate([{$match: {first:{$in:['a','e','i','o','u']}}},
                   {$group: {_id:"$first", 
                             largest:{$max:"$size"}, 
                             smallest:{$min:"$size"}, 
                             total:{$sum:1}}},
                   {$sort: {_id:1}}]).toArray(function(err, results){
                    console.log("Largest and smallest word sizes for " +
                                "words beginning with a vowel: ");
                    console.log(results);
                  });


  words.aggregate([{$match: {size:4}},
                   {$limit: 5},
                   {$project: {_id:"$word", stats:1}}]).toArray(function(err, results){
                    console.log("Stats for 5 four letter words: ");
                    console.log(results);
                  });


  words.aggregate([{$group: {_id:"$first", average:{$avg:"$size"}}},
                    {$sort: {average:-1}},
                    {$limit: 5}]).toArray(function(err, results){
                      console.log("Letters with largest average word size: ");
                      console.log(results);
                    });
}