/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Validation in an Important part of the Mongoose Framework, allowing us to pass checks against the schema before saving to the DB  *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

//Set up the connection string
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

//Validate the length of the newWord is greater than 0
Words.schema.path('word').validate(function(value){
  return value.length > 0;
}, "Word is Too Small");
//Validate the length of the newWord is less than 20
Words.schema.path('word').validate(function(value){
  return value.length < 20;
}, "Word is Too Big");

//Once connected to the database, execute the following:
mongoose.connection.once('open', function(){
  // Set up the object to add a new words
  var newWord = new Words({
    word:'supercalifragilisticexpialidocious',
    first:'s',
    last:'s',
    size:'supercalifragilisticexpialidocious'.length,
  });
  //Save it to the database (and we expect errors so repeat all those to the console)
  newWord.save(function (err) {
    console.log(err.errors.word.message);
    console.log(String(err.errors.word));
    console.log(err.errors.word.type);
    console.log(err.errors.word.path);
    console.log(err.errors.word.value);
    console.log(err.name);
    console.log(err.message);
    //Close the connection
    mongoose.disconnect();
  });
});