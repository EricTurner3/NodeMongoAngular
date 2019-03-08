/************************
 * In the book, these are several files, I put each logic in a method to be called so we can just call them all by passing an argument
 ************************/

//Constants for connection
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://dbadmin:g4DqPy@localhost:27017';
//To make it fun we can pass 'create', 'list', 'find', 'update' and this script will do it all

//A function that will handle the inserts
function addObject(collection, object){
    collection.insert(object,function(err, result){
        if(!err){
            console.log("Inserted: ");
            console.log(result);
        }
        else{
            console.log("Error on Inserting: ");
            console.log(err);
        }
    });
}

//doc_insert.js - Insert documents into a collection
function createCollections(client, database, collectionName){
    //Drop the collection
    database.dropCollection(collectionName);
    //Recreate the collection
    database.createCollection(collectionName, function(err, collection){
        //Use the function we wrote to add the objects to the collection
        addObject(collection, {ngc:"NGC 7293",name:"Helix",type:"planetary",location:"Aquila"});
        addObject(collection, {ngc:"NGC 6543",name:"Cat's Eye",type:"planetary",location:"Draco"});
        addObject(collection, {ngc:"NGC 1952",name:"Crab",type:"supernova",location:"Taurus"});
        client.close();
    });
}

//ch 13 - list the collections we created for viewing
function listCollections(client, database){
    database.collections(function(err, collectionNames){
        console.log("Collections: ");
        console.log(collectionNames);
        client.close();
    });
}

//doc_find.js - Finding documents in a MongoDB collection
function findDocuments(client, database, collectionName){
    database.collection(collectionName, function(err, collection){
        //First way is to use Find and return an array of all the documents
        collection.find(function(err, items){
            items.toArray(function(err,itemArr){
                console.log("Document Array: ");
                console.log(itemArr);
            });
        });
        //Second way is to use Find and a loop to return each document out individually (in this case, to the console)
        collection.find(function(err, items){
            items.each(function(err,item){
                console.log("Singular Document: ");
                console.log(item);
            });
        });

        //Third way is to use FindOne and provide more information on which object we want (only returns one item)
        //the first argument is like a SQL WHERE clause, it searches for whatever is in the first parameter and returns the first object it finds from the DB
        collection.findOne({type:'planetary'}, function(err,item){
            console.log("Found One: ");
            console.log(item);
        });
    
    });
}

function updateDocuments(client, database, collectionName){
    database.collection(collectionName, function(err, collection){
        //This will find all items that are of type planetary
        collection.find({type:"planetary"}, function(err, items){
            items.toArray(function(err, itemArr){
                //Log the before update to the console
                console.log("Before Update: ");
                console.log(itemArr);
                //Now let's perform the update (DIFFERENT FROM THE BOOK, UPDATE HAS BEEN DEPRECATED)
                collection.updateMany(
                    {type:"planetary"},
                    {$set: {type:"Planetary", updated:true}},
                    {upsert:false, multi:true, w:1},
                    function(err,results){
                        //Find the items for the updated type
                        collection.find({type:"Planetary"}, function(err, items){
                            items.toArray(function(err, itemArr){
                                //And list them to the console
                                console.log("After Update: ");
                                console.log(itemArr);
                                //Close the connection
                                client.close();
                            })
                        });
                    }
                );
            });
        });
    });
}


//Connect to the database and insert data
MongoClient.connect(url, {useNewUrlParser: true},
 function(err, client) {
     console.log('Connected to DB!');
    //Load up the astro DB (which doesnt exist at time of writing but will be created)
    var myDB = client.db('astro');
    //Argument 2 is what is passed after the document.js
    //So node document.js create will launch the create section
    console.log('Performing action: ' + process.argv[2]);
    //based on the argument passed, call a different method:
    if(process.argv[2] == null){
        console.log("ERROR: Please pass one of the following arguments: create, list, find, update.");
        client.close();
    }
    if(process.argv[2] == 'create' )
        createCollections(client, myDB, "nebulae"); //Create the collection "nebulae" and fill with some documents
    else if(process.argv[2] == 'list')
        listCollections(client, myDB);//List the collections in the database
    else if(process.argv[2] == 'find')
        findDocuments(client, myDB, "nebulae");//Find specfic documents (Kinda like SQL SELECT * ... or SELECT * WHERE...)
    else if(process.argv[2] == 'update')
        updateDocuments(client, myDB, "nebulae"); //Update specfic documents

 });
