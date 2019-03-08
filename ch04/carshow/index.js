var events = require('events');

function CarShow(){
    events.EventEmitter.call(this);
    //Method for this object that emits a custom event by passing the make through to the callback
    this.seeCar = function(make){
        this.emit('sawCar', make); //This is what is different from the account index.js. A parameter is passed with the emit
    };
}

CarShow.prototype.__proto__ = events.EventEmitter.prototype;

//Purpose: echo back out whatever car was passed to the function
function logCar(make){
    console.log("Saw a " + make);
}

//Purpose: echo the color and make of what is passed to the function
function logColorCar(make, color){
    console.log("Saw a %s %s", color, make);
}

var show = new CarShow();
//Event listener, on sawCar: log the car by passing the make through the callback
show.on("sawCar", logCar);
//Event listener, on sawCar: pick a random color and log the car
show.on("sawCar", function(make){
    //List of colors to choose from
    var colors = ['red', 'black', 'blue', 'orange', 'yellow', 'purple', 'crimson', 'gray'];
    //Randomly pick a color from the list
    var color = colors[Math.floor(Math.random()*8)];
    //Call the function to log the make and color
    logColorCar(make, color);
});

//Dummy statements to test the functionality
show.seeCar("Ferrari");
show.seeCar("Porsche");
show.seeCar("Bugatti");
show.seeCar("Lamborghini");
show.seeCar("Aston Martin");