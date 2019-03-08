//Constants for connection
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://dbadmin:g4DqPy@localhost:27017';
const dbName = 'admin'

//Schema: mongodb://username:pass@server:port
MongoClient.connect(url, {useNewUrlParser: true},
 function(err, client) {
  if (err){
    console.log("Connection Failed Via Client Object.");
  } else {
    console.log("Connected via Client Object . . .");

    //Now that we are connected lets do something

    //Query the adminDB for databases
    var adminDB = client.db(dbName).admin();
    adminDB.listDatabases(function(err, databases){
        //List the databases to console
        console.log(databases);

        //Close connection once we are done listing the databases
        client.close();
        console.log("Connection closed . . .");
    });
  }
});