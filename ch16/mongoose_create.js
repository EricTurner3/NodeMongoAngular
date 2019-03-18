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
//On connection
mongoose.connection.once('open', function(){
  //Create a new document based on the schema
  var newWord1 = new Words({
    word:'gratifaction',
    first:'g', last:'n', size:12,
    letters: ['g','r','a','t','i','f','c','o','n'],
    stats: {vowels:5, consonants:7}
  });
  //Check to see if the document is new (returns true or false)
  console.log("Is Document New? " + newWord1.isNew);
  //Save the document to the database
  newWord1.save(function(err, doc){
    console.log("\nSaved document: " + doc);
  });

  //Create another new document
  var newWord2 = { word:'googled',
    first:'g', last:'d', size:7,
    letters: ['g','o','l','e','d'],
    stats: {vowels:3, consonants:4}
  };

  //Create a third new document
  var newWord3 = {
    word:'selfie',
    first:'s', last:'e', size:6,
    letters: ['s','e','l','f','i'],
    stats: {vowels:3, consonants:3}
  };

  //Use the create method to save both words to the database
  Words.create([newWord2, newWord3], function(err){
    for(var i=1; i<arguments.length; i++){
      console.log("\nCreated document: " + arguments[i]);      
    }
    //Close the connection
    mongoose.disconnect();
  });
});