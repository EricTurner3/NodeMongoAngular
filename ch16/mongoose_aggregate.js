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
//After 3 seconds, close the connection 
setTimeout(function(){mongoose.disconnect();}, 3000);
//On connection, do this:
mongoose.connection.once('open', function(){
  //Example 1: Implementing the aggregation framework like the native driver
  //Use the aggregation framework to find the largest and smallest word sizes for words beginning with a vowel
  Words.aggregate([{$match: {first:{$in:['a','e','i','o','u']}}},
                           {$group: {_id:"$first", 
                             largest:{$max:"$size"}, 
                             smallest:{$min:"$size"}, 
                             total:{$sum:1}}},
                   {$sort: {_id:1}}],
              function(err, results){
    console.log("\nLargest and smallest word sizes for " +
                "words beginning with a vowel: ");
    console.log(results);
  });

  //Example 2: Create an Aggregate object and append operations to the object in subsequent lines
  var aggregate = Words.aggregate();
  //Find all words of length four
  aggregate.match({size:4});
  //Limit the results to only 5
  aggregate.limit(5);
  //Display the stats for the words
  aggregate.append({$project: {_id:"$word", stats:1}});
  //Execute and Output to console
  aggregate.exec(function(err, results){
    console.log("\nStats for 5 four letter words: ");
    console.log(results);
  });

  //Example 3: Create an aggregate object
  var aggregate = Words.aggregate();
  //Group the words by first letter and also average size
  aggregate.group({_id:"$first", average:{$avg:"$size"}});
  //Sort by average, descending
  aggregate.sort('-average');
  //Limit only 5 results
  aggregate.limit(5);
  //Execute and output to the console
  aggregate.exec( function(err, results){
    console.log("\nLetters with largest average word size: ");
    console.log(results);
 });
});