var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://dbadmin:g4DqPy@localhost:27017';
//MongoClient now returns a client not a DB like the book specifies
MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
  var myDB = client.db("words"); // Choose the DB we will be using
  myDB.collection("word_stats", limitFields); //Grab the collection (like a SQL Table) and execute the following function with it
  setTimeout(function(){client.close();}, 3000); //Pause to allow completion of the callbacks
});

//Limit Fields
//This is comparable to selecting certain attributes in a SQL Server query instead of using the all wildcard (*)
//Parameters: err - Handle any errors the connection throws
//            words - The collection we are using (can be named anything)
function limitFields(err, words){
  //Using 0 will exclude the fields charsets from appearing
  words.findOne({word:'the'}, {fields:{charsets:0}}, 
                function(err, item){
    console.log("Excluding fields object: ");
    console.log(JSON.stringify(item, null, 2));
  });
  //Using 1 will include the fields word, size and stats
  //like using SELECT word, size, stats FROM word_stats
  words.findOne({word:'the'}, {fields:{word:1,size:1,stats:1}},
                function(err, item){
    console.log("Including fields object: ");
    console.log(JSON.stringify(item, null, 2));
  });
}