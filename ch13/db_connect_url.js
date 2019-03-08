var MongoClient = require('mongodb').MongoClient;
//Schema: mongodb://username:pass@server:port/dbName
MongoClient.connect('mongodb://dbadmin:g4DqPy@localhost:27017/admin', {useNewUrlParser: true},
 function(err, db) {
  if (err){
    console.log("Connection Failed Via Client Object.");
  } else {
    console.log("Connected Via Client Object . . .");
    db.logout(function(err, result) {
      if(!err){
        console.log("Logged out Via Client Object . . .");
      }
      db.close();
          console.log("Connection closed . . .");
    });
  }
});