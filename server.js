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

function handleError(res, stacktrace, msg) {
    console.log(stacktrace, msg);
    res.status(200).json(stacktrace+msg).end();
}

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
// Connect to the database before starting the application server.
var db;
mongodb.MongoClient.connect("mongodb://admin:admin1234@ds121282.mlab.com:21282/gradrec", { useNewUrlParser: true }, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = database.db('gradrec');
    console.log("Database connection ready");


    app.listen(3331, function () {
        console.log("Listening on 3331");
    });


    //=============WEB PAGES=======================================
    app.get('/', function (req, res) {
        res.render('pages/dashboard', {query : req.query});
    });
    app.get('/login', function (req, res) {
        res.render('pages/login');
    });
    app.get('/signup', function (req, res) {
        res.render('pages/signup');
    });
    app.get('/profile', function (req, res) {
        res.render('pages/profile', {query : req.query});
    });
    app.get('/projectCreation', function (req, res) {
        res.render('pages/projectCreation', {query : req.query});
    });
    app.get('/dashboard', function (req, res) {
        res.render('pages/dashboard', {query : req.query});
    });
    app.get('/research', function (req, res) {  // GET /research?id=5
        res.render('pages/research', {query : req.query});
    });
    app.get('/studentSurvey', function (req, res) {
        res.render('pages/studentSurvey', {query : req.query});
    });
    //===========================================================



    //=============USER DB ENDPOINTS==============================
    app.get("/users", function (req, res) {
        db.collection("users").find({}).toArray(function (err, docs) {
            if (err) {
                handleError(res, err.message, "Failed to get contacts.");
            } else {
                res.status(200).json(docs);
            }
        });
    });
    app.get("/users/:id", function (req, res) {
        db.collection("users").findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to get contact");
            } else {
                res.status(200).json(doc);
            }
        });
    });
    app.post("/users", function (req, res) {
        var newContact = req.body;
        newContact.createDate = new Date();

        if (!(req.body.firstName || req.body.lastName)) {
            handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
        }

        db.collection("users").insertOne(newContact, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to create new contact.");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    });
    app.put("/users/:id", function (req, res) {
        var updateDoc = req.body;
        delete updateDoc._id;

        db.collection("users").updateOne({ _id: new ObjectID(req.params.id) }, updateDoc, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to update User");
            } else {
                res.status(204).end();
            }
        });
    });
    //===========================================================



    //===============PROJECTS DB ENDPOINTS========================
    app.get("/projects", function (req, res) {
        db.collection("projects").find({}).toArray(function (err, docs) {
            if (err) {
                handleError(res, err.message, "Failed to get contacts.");
            } else {
                res.status(200).json(docs);
            }
        });
    });
    app.get("/projects/:id", function (req, res) {
        db.collection("projects").findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to get contact");
            } else {
                res.status(200).json(doc);
            }
        });
    });
    app.post("/projects", function (req, res) {
        var newContact = req.body;
        newContact.createDate = new Date();

        if (!(req.body.firstName || req.body.lastName)) {
            handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
        }

        db.collection("projects").insertOne(newContact, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to create new contact.");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    });
    app.put("/projects/:id", function (req, res) {
        var updateDoc = req.body;
        delete updateDoc._id;

        db.collection("projects").updateOne({ _id: new ObjectID(req.params.id) }, updateDoc, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to update User");
            } else {
                res.status(204).end();
            }
        });
    });
    //===============================================================



    //=================NOTIFICATIONS DB ENDPOINTS====================
    app.get("/notifications", function (req, res) {
        db.collection("notifications").find({}).toArray(function (err, docs) {
            if (err) {
                handleError(res, err.message, "Failed to get contacts.");
            } else {
                res.status(200).json(docs);
            }
        });
    });
    app.get("/notifications/:id", function (req, res) {
        db.collection("notifications").findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to get contact");
            } else {
                res.status(200).json(doc);
            }
        });
    });
    app.post("/notifications", function (req, res) {
        var newContact = req.body;
        newContact.createDate = new Date();

        if (!(req.body.firstName || req.body.lastName)) {
            handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
        }

        db.collection("notifications").insertOne(newContact, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to create new contact.");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    });
    app.put("/notifications/:id", function (req, res) {
        var updateDoc = req.body;
        delete updateDoc._id;

        db.collection("notifications").updateOne({ _id: new ObjectID(req.params.id) }, updateDoc, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to update User");
            } else {
                res.status(204).end();
            }
        });
    });
    //===============================================================



    //==================MESSAGES DB ENDPOINTS========================
    app.get("/messages", function (req, res) {
        db.collection("messages").find({}).toArray(function (err, docs) {
            if (err) {
                handleError(res, err.message, "Failed to get contacts.");
            } else {
                res.status(200).json(docs);
            }
        });
    });
    app.get("/messages/:id", function (req, res) {
        db.collection("notifications").findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to get contact");
            } else {
                res.status(200).json(doc);
            }
        });
    });
    app.post("/messages", function (req, res) {
        var newContact = req.body;
        newContact.createDate = new Date();

        if (!(req.body.firstName || req.body.lastName)) {
            handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
        }

        db.collection("messages").insertOne(newContact, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to create new contact.");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    });
    app.put("/messages/:id", function (req, res) {
        var updateDoc = req.body;
        delete updateDoc._id;

        db.collection("messages").updateOne({ _id: new ObjectID(req.params.id) }, updateDoc, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to update User");
            } else {
                res.status(204).end();
            }
        });
    });
    //==============================================================



});


module.export = {
    db: db
}