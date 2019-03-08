//Constants for connection
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://dbadmin:g4DqPy@localhost:27017';

//Schema: mongodb://username:pass@server:port
MongoClient.connect(url, {useNewUrlParser: true},
 function(err, client) {
  if (err){
    console.log("Connection Failed Via Client Object.");
  } else {
    console.log("Connected via Client Object . . .");
    //Now that we are connected lets do something

    //Create a new database
    var newDB = client.db("newDB");
    //Retrieve the list of collections
    //Notice how the next step is always nested in the previous step.
    newDB.collections(function(err, collectionNames){
        console.log("Initial collections: ");
        console.log(collectionNames);
        //Now we are going to create a new collection
        newDB.createCollection("newCollection", function(err, collection) {
            //After creating we are going to retrieve the collections list again
            newDB.collections(function(err, collectionNames){
                console.log("Collections after Creation: ");
                console.log(collectionNames);
                //Now lets drop the collection
                newDB.dropCollection("newCollection", function(err, collection){
                    //And now relist the collections
                    newDB.collections(function(err, collectionNames){
                        console.log("Collections after deletion: ");
                        console.log(collectionNames);
                        //We are done so close connection;
                        client.close();
                    });
                });
            });
        });
    });
    
  }
});