//Base Setup
//
//======================================================



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

//for working w/ our database
var mongoose = require('mongoose');

//set port for the app
var port    = process.env.PORT || 8080;

var jwt = require('jsonwebtoken');

var superSecret = 'ilovevideogameygamegames';


//APP CONFIGURATION-----------------------------------

//connect to our database(hosted on mongolab.com)
mongoose.connect('mongodb://kool:dakool12@ds017678.mlab.com:17678/mean-test');
// app.set('superSecret', config.secret);

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

//route for authenticating users (POST http://localhost:8080/api/authenticate)
apiRouter.post('/authenticate', function(req, res){

  //find user
  //select the name username and password explicitly
  User.findOne({
    username: req.body.username
  }).select('name username password').exec(function(err, user){

    if(err) throw err;

    //no user with that username was found
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else if (user) {

      //check if password matches
      var validPassword = user.comparePassword(req.body.password);
      if  (!validPassword) {
        res.json({
          success: false,
          message: 'Authentication failed.  Wrong password.'
        });
      } else {

        //if user is found and password is right
        //create a token
        var token = jwt.sign({
          name: user.name,
          username: user.username
        }, superSecret, {

          //expires in 24 hours
          expiresInMinutes: 1440
        });

        //return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
});


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

  //set the users information ( comes from the request)
  user.name      =  req.body.name;
  user.username  =  req.body.username;
  user.password  =  req.body.password;

  //save the user and check for errors

  user.save(function(err){
    if (err) {
      //duplicate entry
      if (err.code == 11000)
        return res.json({ success: false, message: 'A user with that  username already exists. ' })
      else 
        return res.send(err);
    }

    res.json({ message: 'User Created!'});
  });
})

//get all users (accessed at GET http://localhost:8080/api/users)
.get(function(req, res){
  User.find(function(err, users){
    // console.dir(req.body)
    if (err)
      res.send(err);

    //return users
    res.json(users);
  });
});

//routes that end in /users/:user_id
//---------------------------------------------------------
apiRouter.route('/users/:user_id')

//get the user with that id (accessed at GET http://localhost:8080/api/users/:user_id)
.get(function(req, res){
  
  User.findById(req.params.user_id, function(err, user){
    if(err)
      res.send(err);

    //return that user
    res.json(user);
  });
})

//update the user with id (accessed at PUT http://localhost:8080/api/users/:user_id)
.put(function(req, res){

  //use our model to get user
  User.findById(req.params.user_id, function(err, user){
    if(err)
      res.send(err);

    //update the users info only if it's new
    if (req.body.name) user.name         = req.body.name;
    if (req.body.username) user.username = req.body.username;
    if (req.body.password) user.password = req.body.password;

    //save the user

    user.save(function(err){
      if (err) res.send(err);

      //return message
      res.json({ message: 'User updated!'});
    });
  });
})

//delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id
.delete(function(req, res){
  User.remove({
    _id: req.params.user_id }, function(err, user){
      if (err)
        return res.send(err);

      res.json({ message: 'Successfully deleted' });
    });
});



// REGISTER OUR ROUTES ------------------------------------------------

// all routes will be prefixed with /api

app.use('/api', apiRouter);

//  START THE SERVER
// ======================================================

app.listen(port);
console.log('Magic happens on port ' + port);






