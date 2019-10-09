var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
//var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');
var signupAndSignIn = require('./src/allRoutes/signupAndSignIn');
const itemRoute = require("./src/allRoutes/itemRoute");
const restaurantSearchRoute = require('./src/allRoutes/restaurantSearchRoute');
const cartRoute = require('./src/allRoutes/cartRoute');
const orderRoute = require('./src/allRoutes/orderRoute');
const profileRoute = require('./src/allRoutes/profileRoute');
const dbConnPool = require("./src/dbAccess/dbConnPool");
//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret              : 'cmpe273_kafka_passport_mongo',
    resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000
}));

 app.use(bodyParser.urlencoded({
     extended: true
   }));
app.use(bodyParser.json());

//Allow Access Control
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

/*  testDBConection = async() => {
    let con =  await dbConnPool.getConnection();
    if(con){
      console.log("Connected to Database");
      let insertedUser = await con.query("INSERT INTO OWNER_DETAILS VALUES ('aa','vv')");
     // con.query("INSERT INTO BUYER_DETAILS VALUES ('anj','123')");
    } else{
        console.log("not connected to DB");
    }
  }
  testDBConection();*/

app.use("/", signupAndSignIn);
app.use("/", itemRoute);
app.use("/", restaurantSearchRoute);
app.use("/", cartRoute);
app.use("/", orderRoute);
app.use("/", profileRoute);
//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");