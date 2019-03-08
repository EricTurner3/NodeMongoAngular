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
//doc_update.js Update the collections (update has been deprecated, so I used updateMany)
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

//doc_save.js
//Easier implementation of insert or updating. Virtually the same as an update
//Save is also deprecated, but works at this time 08 Mar 2019
//Says to use insertOne, insertMany, updateOne or updateMany instead
//In this case we would updateOne
function saveDocument(client, database, collectionName){
    //Get the collection
    database.collection(collectionName, function(err, collection){
        //Find one document of type supernova
        collection.findOne({type:"supernova"}, function(err, item){
            console.log("Before Save: ");
            console.log(item);
            console.log("Adding an Info Attribute...");
            //This is where we are accessing a specfic attribute of the item and updating it
            item.info = "Some New Info";
            //Now lets save it to the database
            //DEPRECATED: in future use updateOne()
            collection.save(item, {w:1}, function(err, results){
                //Use findOne and pass the item ID from last time so we are sure we grab the same item
                collection.findOne({_id:item._id}, function(err, savedItem){
                    console.log("After Save: ");
                    console.log(savedItem);
                    //Close connection to db
                    client.close();
                });
            });
        });
    });
}

//doc_upsert.js
//Upserting is intersting to me. It will update the object if it exists or insert it if it does not.
//Normal updates do NOT automatically insert objects because it can be a performance hit, so if we know the object exists for a fact
//Then use a traditional update() or if we know for a fact it does not exist then use an insert().
function upsertDocument(client, database, collectionName){
    //Access the named collection
    database.collection(collectionName, function(err, collection){
        //Find all documents in the collection of type "diffuse"
        collection.find({type:"diffuse"}, function(err, items){
            //Add all the items to an array
            items.toArray(function(err, itemArr){
                //Log each item to the console
                console.log('Before Upsert: ');
                console.log(itemArr);
                //Now lets call update one and set upsert to true
                collection.updateOne(
                    {type:"diffuse"},
                    {$set: {ngc:"NGC 3372", name:"Carina", type:"diffuse",location:"Carina"}},
                    {upsert:true, w:1, forceServerObjectId:false},
                    function(err,results){
                        //Find all items again of type diffuse
                        collection.find({type:"diffuse"}, function(err, items){
                            //Add this set of items to an array
                            items.toArray(function(err, itemArr){
                                console.log('After Upsert 1: ');
                                console.log(itemArr);
                                //Grab the itemID of the first index of returned items
                                var itemID = itemArr[0]._id;
                                //Upsert this item again
                                collection.updateOne(
                                    {_id:itemID},
                                    {$set: {ngc:"NGC 3372", name:"Carina", type:"diffuse",location:"Carina", updated:true}},
                                    {upsert:true, w:1, forceServerObjectId:false},
                                    function(err, results){
                                        collection.findOne({_id:itemID}, function(err, item){
                                            console.log("After Upsert 2: ");
                                            console.log(item);
                                            //Close the connection
                                            client.close();
                                        });
                                    });
                            });
                        });
                });
            });
        });
    });
}

//doc_delete.js
//Delete multiple documents from a collection
//remove is deprecated, use deleteOne, deleteMany or bulkWrite
function deleteDocuments(client, database, collectionName){
    //Grab the collection
    database.collection(collectionName, function(err, collection){
        //Find all documents in the collection
        collection.find(function(err, items){
            //Store those items in an array
            items.toArray(function(err, itemArr){
                //Print out a list of the items to console before we perform a delete
                console.log("Before Delete: ");
                console.log(items);
                //Remove all documents of type planetary from the collection
                collection.deleteMany({type:"planetary"}, function(err, results){
                    //Print to console the number of documents we removed
                    console.log("Deleted " + results + " documents.");
                    //Perform a search in the collection for all items after we performed this delete
                    collection.find(function(err, items){
                        //Store these items in an array
                        items.toArray(function(err, itemArr){
                            //Print array to console
                            console.log("After Delete: ");
                            console.log(itemArr);
                            //Close the client connection
                            client.close();
                        });
                    });
                });
            });
        });
    });
}

//doc_delete_one.js
//Delete a single document from a collection
//The book uses findAndRemove which no longer exists at all
//I use deleteOne
function deleteDocument(client, database, collectionName){
    //Grab the collection
    database.collection(collectionName, function(err, collection){
        //Search in the collection for all documents
        collection.find(function(err, items){
            //Load them into an array
            items.toArray(function(err, itemArr){
                //Print all the documents we found before we perform a delete
                console.log("Before Delete: ");
                console.log(itemArr);
                //findAndRemove is completely deprecated, I am using deleteOne instead
                collection.deleteOne({type:"planetary"}, function(err, results){
                    console.log("Deleted " + results + " documents.");
                    //Perform a search on the collection for all documents remaining after the deletion
                    collection.find(function(err, items){
                        items.toArray(function(err, itemArr){
                            console.log("After Delete: ");
                            console.log(itemArr);
                            //Close the connection to the DB
                            client.close();
                        })
                    });
                });
            });
        });
    });
}

//Connect to the database and perform one of the above tasks
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
        console.log("ERROR: Please pass one of the following arguments: create, list, find, update, save, upsert, deleteM, deleteO");
        client.close();
    }
    //Go from top to bottom is how the chapter goes as well with its examples
    if(process.argv[2] == 'create' )
        createCollections(client, myDB, "nebulae"); //Create the collection "nebulae" and fill with some documents
    else if(process.argv[2] == 'list')
        listCollections(client, myDB);//List the collections in the database
    else if(process.argv[2] == 'find')
        findDocuments(client, myDB, "nebulae");//Find specfic documents (Kinda like SQL SELECT * ... or SELECT * WHERE...)
    else if(process.argv[2] == 'update')
        updateDocuments(client, myDB, "nebulae"); //Update specfic documents
    else if(process.argv[2] == 'save')
        saveDocument(client, myDB, "nebulae"); //Save a change to a document
    else if(process.argv[2] == 'upsert')
        upsertDocument(client, myDB, "nebulae"); //Upsert a document to the collection
    else if(process.argv[2] == 'deleteM')
        deleteDocuments(client, myDB, "nebulae"); //Delete many documents
    else if(process.argv[2] == 'deleteO')
        deleteDocument(client, myDB, "nebulae"); //Delete a single document

 });
