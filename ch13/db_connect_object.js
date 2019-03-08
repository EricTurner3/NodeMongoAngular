var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;

  //Does not work this way. db_connect_url does work
var db = new Db('test', new Server('localhost', 27017));
db.open(function(err, mongoClient) {
  if (err){
    console.log("Connection Failed Via Client Object.");
  } else {
    var adminDb = mongoClient.admin();
    if (adminDb){
      console.log("Connected Via Client Object . . .");
      //Authentication parameters "username", "pass"
      adminDb.authenticate("dbadmin", "g4DqPy", function(err, results){
        if (err){
          console.log("Authentication failed . . .");
          adminDb.close();
          console.log("Connection closed . . .");
        }else {
          console.log("Authenticated Via Client Object . . .");
          adminDb.logout(function(err, result) {
            if(!err){
              console.log("Logged out Via Client Object . . .");
            }
            adminDb.close();
            console.log("Connection closed . . .");
          });
        }        
      });
    }
  }
});