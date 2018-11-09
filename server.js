const express = require('express');
const app = express();

var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('assets', { root: __dirname }));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
// Connect to the database before starting the application server.
var db;
mongodb.MongoClient.connect("mongodb://admin:admin1234@ds121282.mlab.com:21282/gradrec", { useNewUrlParser: true }, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = database;
    console.log("Database connection ready");

    //  use res.render to load up an ejs view file
    app.listen(3331, function () {
        console.log("Listening on 3331");
    });

    app.get('/', function (req, res) {
        //response.sendFile('pages/home/index.html' , { root : __dirname});
        res.render('pages/dashboard');
    });

    app.get('/login', function (req, res) {
        res.render('pages/login');
    });

    app.get('/signup', function (rq, res) {
        res.render('pages/signup');
    });

    app.get('/profile', function (rq, res) {
        res.render('pages/profile');
    });

    app.get('/projectCreation', function (rq, res) {
        res.render('pages/projectCreation');
    });

    app.get('/dashboard', function (rq, res) {
        res.render('pages/dashboard');
    });


    app.get('/research', function (rq, res) {
        res.render('pages/research');
    });

    app.get('/studentSurvey', function (rq, res) {
        res.render('pages/studentSurvey');
    });

});


module.export = {
  db : db
}