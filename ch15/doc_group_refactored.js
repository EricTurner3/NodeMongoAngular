var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://dbadmin:g4DqPy@localhost:27017';

//MongoClient now returns a client not a DB like the book specifies
MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
  var myDB = client.db("words"); // Choose the DB we will be using
  myDB.collection("word_stats", groupItems); //Grab the collection (like a SQL Table) and execute the following function with it
  setTimeout(function(){client.close();}, 3000); //Pause to allow completion of the callbacks
});

//In order for me to refactor the documents from group to aggregate, I need to query the database for the specific words
//to get a feel for what I am working with

function queryDatabase(err, collection){
    collection.find({first:'o',last:{$in:['a','e','i','o','u']}}, function(err, items){
        items.each(function(err,item){
            console.log("Singular Document: ");
            console.log(item);
        });
    });
}

// Here is an example of the result for one document:
/*
{ _id: 5c8647ca4bc9a0c166b9f1d7,
  word: 'objective',
  first: 'o',
  last: 'e',
  size: 9,
  letters: [ 'o', 'b', 'j', 'e', 'c', 't', 'i', 'v' ],
  stats: { vowels: 4, consonants: 5 },
  charsets:[ 
    { type: 'consonants', chars: [Array] },
    { type: 'vowels', chars: [Array] } 
  ] 
}

*/

//So using this reference guide: https://docs.mongodb.com/manual/reference/operator/aggregation/
//I will try to change the queries in doc_group.js from the deprecated group method to the new aggregation method

function groupItems(err, collection){
    //12 March 2019 @ 0824: It works!!!! It returns the last letter as _id and then counts. I wonder if I can get it to return first, last, count
    //Resources used:
    //  - $sortByCount: https://docs.mongodb.com/manual/reference/operator/aggregation/sortByCount
    //  - Node.js Tutorial: https://mongodb.github.io/node-mongodb-native/2.0/tutorials/aggregation/
    collection.aggregate([
        {$match: {first: 'o', last:{$in:['a','e','i','o','u']}}}, //Match documents where first is 'o' and last is a vowel
        //In order to actually group them by $last we can do one of two ways:
        //{$group: {_id: "$last",  count:{$sum: 1}}}, //Method One: Use a $group followed by a $sort
        //{$sort: {count: -1}}                        //Part of Method One
        {$sortByCount: "$last"}   //Method Two: Combine Method One's $group + $sort into one line with $sortByCount
        
        ]).toArray(function(err, docs){
            console.log("\n'O' words grouped by first and last" +
                        " letter that end with a vowel: ");
            console.log(docs);
        });

    //12 March 2019 @ 0850: The counts are correct, however now I need to work on implementing the totalVowels.
    //12 March 2019 @ 0853: Instead of using method two, using method one (see above) I can specify totalVowels
    //Bonus, it also sorts them in descending order instead of at random like the book originally
    collection.aggregate([
        {$match: {size:{$gt:13}}},
        {$group: {_id: "$first",  count:{$sum: 1}, totalVowels:{$sum:"$stats.vowels"}}},
        {$sort: {count: -1}}                        
    ]).toArray(function(err, docs){
        console.log("\nWords grouped by first letter larger than 13: ");
            console.log(docs);
    });

    //12 March 2019 @ 0954: This one took some work. I was able to get everything but the total working. 
    //Turns out if you use $addFields and just add $vowels and $consonants in the next step then it works!
    collection.aggregate([
        //Group by first, grab count, vowels and consonants
        {$group:{_id: "$first",  count:{$sum: 1},vowels:{$sum:"$stats.vowels"}, consonants:{$sum:"$stats.consonants"}}},
        //After we grab the vowels and consonants, we can add a field in the next step to add the total from those values
        {$addFields:{total:{$sum:["$vowels", "$consonants"]}}},
        {$sort: {count: -1}}   
    ]).toArray(function(err, docs){
        console.log("\nWords grouped by first letter with totals: ");
            console.log(docs);
    });


}