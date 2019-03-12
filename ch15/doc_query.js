
//Constants for connection
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://dbadmin:g4DqPy@localhost:27017';


function displayWords(msg, cursor, pretty){
    cursor.toArray(function(err, itemArr){
      console.log("\n"+msg);
      var wordList = [];
      for(var i=0; i<itemArr.length; i++){
        wordList.push(itemArr[i].word);
      }
      console.log(JSON.stringify(wordList, null, pretty));
    });
  }

  //Find specfic items (comparable to sql server: SELECT * FROM words WHERE ...)
  function findItems(err, words){
      //Find all words where first letter is  a, b or c
    words.find({first:{$in: ['a', 'b', 'c']}}, function(err, cursor){
      displayWords("Words starting with a, b or c: ", cursor);
    });
    //Find all words where length > 12
    words.find({size:{$gt: 12}}, function(err, cursor){
      displayWords("Words longer that 12 characters: ", cursor);
    });
    //Find all words where mod(length/2) = 0 (mod checkes for even amount characters)
    words.find({size:{$mod: [2,0]}}, function(err, cursor){
      displayWords("Words with even Lengths: ", cursor);
    });
    //Find all words where the length is exactly 12 characters
    words.find({letters:{$size: 12}}, function(err, cursor){
      displayWords("Words with 12 Distinct characters: ", cursor);
    });
    //Find all words where first and last character is a vowel
    words.find({$and: [{first:{$in: ['a', 'e', 'i', 'o', 'u']}},
                       {last:{$in: ['a', 'e', 'i', 'o', 'u']}}]}, 
               function(err, cursor){
      displayWords("Words that start and end with a vowel: ", cursor);
    });
    //Find all words where the number of vowels in the word is > 7
    words.find({"stats.vowels":{$gt:6}}, function(err, cursor){
      displayWords("Words containing 7 or more vowels: ", cursor);
    });
    //Find all words where all five vowels are present in the word
    words.find({letters:{$all: ['a','e','i','o','u']}}, function(err, cursor){
      displayWords("Words with all 5 vowels: ", cursor);
    });
    //Find all words where non-alphabet characters exist (apostrophes, hyphens.etc)
    words.find({otherChars: {$exists:true}}, function(err, cursor){
      displayWords("Words with non-alphabet characters: ", cursor);
    });
    //Find all words where two characters are non-alphabet
    words.find({charsets:{$elemMatch:{$and:[{type:'other'},
                                            {chars:{$size:2}}]}}}, 
               function(err, cursor){
      displayWords("Words with 2 non-alphabet characters: ", cursor);
    });
  }

//Connect to the server
MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
    console.log('Connected to DB!');

    //Connect to the words database
    var myDB = client.db("words");
    //Load the word_stats collection and find specfic items
    myDB.collection("word_stats", findItems);

    //Wait 3 seconds then close the connection to the server
    setTimeout(function(){
        client.close();
    }, 3000);
});