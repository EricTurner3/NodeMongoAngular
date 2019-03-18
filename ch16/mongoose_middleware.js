/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Middleware allows you to implement functionality that should be applied before or after a specfic step in the process *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// 18 Mar 2019 - None of the pre/post methods fired in the console when I executed the code, but it did not throw any errors either

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

//Pre-'init', log to the console what is going to happen
Words.schema.pre('init', function (next) {
  console.log('a new word is about to be initialized from the db');
  next();
});
//Before validating, reply out to the console what word is going to be validated
Words.schema.pre('validate', function (next) {
  console.log('%s is about to be validated', this.word);
  next();
});
//Before saving, print out the word going to be saved, and auto set the size to the word length
Words.schema.pre('save', function (next) {
  console.log('%s is about to be saved', this.word);
  console.log('Setting size to %d', this.word.length);
  this.size = this.word.length;
  next();
});

//Before removing the word, log to the console the word to be removed
Words.schema.pre('remove', function (next) {
  console.log('%s is about to be removed', this.word);
  next();
});

//After Init, post a message that the word has been grabbed
Words.schema.post('init', function (doc) {
  console.log('%s has been initialized from the db', doc.word);
});

//After validation post the status of the validation
Words.schema.post('validate', function (doc) {
  console.log('%s has been validated', doc.word);
});

//After saving, post the status of the save
Words.schema.post('save', function (doc) {
  console.log('%s has been saved', doc.word);
});

//After the removal, post the status of the removal
Words.schema.post('remove', function (doc) {
  console.log('%s has been removed', doc.word);
});

//Once connected, do this:
mongoose.connection.once('open', function(){
  //Create a new word based on the schema we have created
  var newWord = new Words({
    word:'newword',
    first:'t',
    last:'d',
    size:'newword'.length,
  });

  //Save the word (will also execute pre and post methods)
  console.log("\nSaving: ");
  newWord.save(function (err){ 
    //Find the new word
    console.log("\nFinding: ");
    Words.findOne({word:'newword'}, function(err, doc){
      //Remove the word (will also execute pre and post methods)
      console.log("\nRemoving: ");
      newWord.remove(function(err){
        //After removal, disconnect from the db
        mongoose.disconnect();
      });
    });
  });
});