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
  //Find all words that start with grati
  Words.find({word:/grati.*/}, function(err, docs){
    //List out the words to the console
    console.log("\nBefore update: ");
    for (var i in docs){
      console.log(docs[i].word + " : " + docs[i].size );
    }
    
    //The book's original update_many (set all the matching words' size to 0)
    setToZero();
    

    //A custom function I created to revert the words back to the original sizes (set to wait 3 seconds so the setToZero has time to complete)
    setTimeout(function(){revertLength(docs);}, 3000);

  });
});

//The book's update many code
function setToZero(){
  //New query to update the size of the words to 0
  query = Words.update({}, {$set: {size: 0}});
  //Set a flag to allow multiple updates
  query.setOptions({multi: true});
  //Update all words with the regex of all words begining with grati
  query.where('word').regex(/grati.*/);
  //Execute the update
  query.exec(function(err, results){
    //Search for the words we have updated plus others that contain 'grat'
    Words.find({word:/grat.*/}, function(err, docs){
      //Print them to the console
      console.log("\nAfter setting to zero update: ");
      for (var i in docs){
        console.log(docs[i].word + " : " + docs[i].size);
      }
    });
  });
}

//I did not like how the book set to 0 but did not change the sizes back to the correct size later, this function corrects that
//Uses the logic of mongoose_update_one (since we are updating one word at a time)
//Parameter: docs (the original docs that were found from the main function)
function revertLength(docs){
  //Counter to check how many words have been updated compared to the original list
  var count = 0;
  ///For each of the words the original search found
  for (var i in docs){
    console.log("\nUpdating Word: " + docs[i].word + " $size to: " + docs[i].word.length);
    Words.findOne({word:docs[i].word}, function(err, doc){
      //New query to update the size of the words to the original size
      var query = doc.update({$set:{word: doc.word, size:doc.word.length}});
      //Execute the update
      query.exec(function(err, results){
        console.log("Update results for : " + doc.word);
        console.log(results);
        //Increment count for each word we go through
        count++;
        //After the last update find all the words and close the connection
        if(count == docs.length){
          //After the four loop grab the updated words
          Words.find({word:/grat.*/}, function(err, docs){
            //Print them to the console
            console.log("\nAfter reverting back update: ");
            for (var i in docs){
              console.log(docs[i].word + " : " + docs[i].size);
            }
            //Close the connection
            mongoose.disconnect();
          });
        }
      });
    });
  }

  
}
