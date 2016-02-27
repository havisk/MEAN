//Base Setup
//
//======================================================

//connect to our database(hosted on mongolab.com)
mongoose.connect('mongodb://<kool>:<dakool12>@ds017678.mlab.com:17678/mean-test')

//Call the Packages------------------------------------

var User    = require('./app/models/user');

// call express
var express = require('express');

//define our app using express
var app     = express();

//get body-parser
var bodyParser = require('body-parser'); 

//used to see request
var morgan  = require('morgan');

//set port for the app
var port    = process.env.PORT || 8080;


//APP CONFIGURATION-----------------------------------

//use body parser so we can grab info from POST requests
app.use(bodyParser.urlencoded({
  extended: true}));

app.use(bodyParser.json());


//configure our app to handle CORS requests
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  res.setHeader('Access-Control-Allow-Headers', ' X-Requested-With, content-type, \ Authorization');

  next();
});

//log all requests to the console
app.use(morgan('dev'));

//ROUTES FOR OUR API
//============================================================

//basic route for the home page
app.get('/', function(req, res){
  res.send('Welcome to the home page!');
});

//get an instance of the express router
var apiRouter = express.Router();


//middleware to user for all requests
apiRouter.use(function(req, res, next){

  //do logging
  console.log('Somebody just came to our app!');

  // we'll add more to the middleware in CH10
  //this is where we authenticate users

  //make sure we go to the next routes and don't stop here
  next();
});

//test route to make sure everything is working
//accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res){
  res.json({ message: 'hoooray! welcome to our api'});
});

//on routes that end in /users
//-------------------------------------------------------------------

apiRouter.route('/users')

//create a user (accessed at POST http://localhost:8080/api/users)
.post(function(req,res){

  //create a new instance of the User Model
  var user  = new User();

  //set the users
})


// REGISTER OUR ROUTES ------------------------------------------------

// all routes will be prefixed with /api

app.use('/api', apiRouter);

//  START THE SERVER
// ======================================================

app.listen(port);
console.log('Magic happens on port ' + port);





