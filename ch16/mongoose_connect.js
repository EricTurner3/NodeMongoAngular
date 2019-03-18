var mongoose = require('mongoose');
//username:password@server:port/database?authSource=admin
//It is ESSENTIAL to pass ?authSource=admin because MongoDB auths on a per DB level.
//The admin credentials are in the admin DB so authSource MUST be passed or auth will FAIL
const username = 'dbadmin';
const password = 'g4DqPy'
const server = 'localhost:27017';
const database = 'words'
const url = 'mongodb://'+username+':'+password+'@'+server+'/'+database+'?authSource=admin';
//Connect to MongoDB
mongoose.connect(url,  {useNewUrlParser: true });
//On connection
mongoose.connection.on('open', function(){
    console.log("Connected to MongoDB");
    //List collections in DB
    mongoose.connection.db.listCollections().toArray(function(err, names){
        console.log(names);
        mongoose.disconnect();
    });
})