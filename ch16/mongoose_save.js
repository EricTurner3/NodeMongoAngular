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
  //Search the database for the document 'book'
  var query = Words.findOne().where('word', 'book');
  //Execute the search query
  query.exec(function(err, doc){
    //Check if the document is new (will return false because it is in the DB)
    console.log("Is Document New? " + doc.isNew);
    //Print out the search result to the console
    console.log("\nBefore Save: ");
    console.log(doc.toJSON());
    //Modify the document
    doc.set('word','Book');
    doc.set('first','B');
    //Print out what fields were modified
    console.log("\nModified Fields: ");
    console.log(doc.modifiedPaths());
    //Save the changes to the database
    doc.save(function(err){
      //Retrieve the document again to view the changes
      Words.findOne({word:'Book'}, function(err, doc){
        //Print the document (now with changes) to the console
        console.log("\nAfter Save: ");
        console.log(doc.toJSON());
        //Close the connection
        mongoose.disconnect();
      });
    });
  });
});