//Packages to require (need to be in the node-modules folder for this directory)
var events = require("events");

//The main constructor
function Account(){
    this.balance = 0;
    events.EventEmitter.call(this); //Inherits the ability to create our own custom events
    
    this.deposit = function(amount){
        this.balance += amount; //Increase the account balance
        this.emit('balanceChanged'); //This is the custom event that gets emitted, we can bind an eventListener to this
    };

    this.withdraw = function(amount){
        this.balance -= amount; //Decrease the account balance
        this.emit('balanceChanged'); //This is the custom event that gets emitted, we can bind an eventListener to this
    }

}
Account.prototype.__proto__ = events.EventEmitter.prototype; //Inherit the prototype of the eventemitter into Account

//Purpose: Display the balance of the account (used with event listener)
function displayBalance(){
    console.log('Account balance: $%d', this.balance);
}

//Purpose: Check if the account is overdrawn (used with event listener)
function checkOverdraw(){
    if (this.balance < 0){
        console.log("Account overdrawn!!!");
    }
}

// Purpose: Check if the account (parameter) has hit its balance goal (parameter)
function checkGoal(acc, goal){
    if (acc.balance > goal){
        console.log("Goal Achieved! Over $%d!!", goal)
    }
}

//Init the Account method and add event listeners
var account = new Account();
//Since we are inheriting the eventEmitter functionality, we can set event listeners
//In this case we are listening for our custom event , balaceChanged, to be emitted and then perform the following action
account.on("balanceChanged", displayBalance);
account.on("balanceChanged", checkOverdraw);
account.on("balanceChanged", function(){checkGoal(this, 1000)});

//Create some dummy transactions
account.deposit(220);
account.deposit(320);
account.deposit(600);
account.withdraw(1200);
