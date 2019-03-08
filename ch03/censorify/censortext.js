//Default censored words shipped from the package
var censoredWords = ['sad', 'bad', 'mad'];
//Allows user to add custom censored words
var customCensoredWords = [];

//Purpose: Censor the words in a given string
function censor(inStr){
    //If the word is in the default list then censor
    for (idx in censoredWords){
        inStr = inStr.replace(censoredWords[idx], "****");
    }
    //Also check the custom list and censor those words
    for (idx in customCensoredWords){
        inStr = inStr.replace(customCensoredWords[idx], "****");
    }
    //Return the now censored string
    return inStr;
}

//Purpose: add a censored word to the list of custom censored words
function addCensoredWord(word){
    customCensoredWords.push(word);
}

//Purpose: Return the List of Default/Custom censored words
function getCensoredWords(){
    return censoredWords.concat(customCensoredWords);
}

//Exports give access for other Node.js applications to use these methods
exports.censor = censor;
exports.addCensoredWord = addCensoredWord;
exports.getCensoredWords = getCensoredWords;
