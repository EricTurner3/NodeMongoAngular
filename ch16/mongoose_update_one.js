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
//On connection, do this:
mongoose.connection.once('open', function(){
  //Find the document 'gratification'
  var query = Words.findOne().where('word', 'gratifaction');
  //Execute the find query
  query.exec(function(err, doc){
    //Print out the retrieved document to the console
    console.log("Before Update: ");
    console.log(doc.toString());
    //Use the update() method to update the following fields
    var query = doc.update({$set:{word:'gratifactions', 
                                  size:13, last:'s'},
                            $push:{letters:'s'}});
    //Execute the update query
    query.exec(function(err, results){
      //Print the results of the update
      console.log("\n%d Documents updated", results);
      //Find the new document we just updated
      Words.findOne({word:'gratifactions'}, function(err, doc){
        //Print it to the console
        console.log("\nAfter Update: ");
        console.log(doc.toString());
        //Close the connection
        mongoose.disconnect();
      });
    });
  });
});