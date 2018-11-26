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
app.use(bodyParser.urlencoded({ extended: true }));

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
    app.get('/messages', function (req, res) {
        res.render('pages/messages', {query : req.query});
    });
    app.get('/notification', function (req, res) {
        res.render('pages/notifications', {query : req.query});
    });
    app.get('/research', function (req, res) {  // GET /research?id=5
            res.render('pages/research', {query : req.query});
    });
    app.get('/studentSurvey', function (req, res) {
        res.render('pages/studentSurvey', {query : req.query});
    });
    app.get('/chat', function (req, res) {
        res.render('pages/chat', {query : req.query});
    });
    //===========================================================



    //=============USER DB ENDPOINTS==============================
    app.get("/users", function (req, res) {
        console.log("User Query" , req.query);
        db.collection("users").find(req.query).toArray(function (err, docs) {
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

        // if (!(req.body.firstName || req.body.lastName)) {
        //     handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
        // }

        db.collection("users").insertOne(newContact, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to create new contact.");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    });
    app.put("/users/:id", function (req, res) {
        console.log("Update User", req.body);
        db.collection("users").updateOne({ _id: new ObjectID(req.params.id) }, {  $set: req.body }, function (err, doc) {
          if (err) {
              handleError(res, err.message, "Failed to get contact");
          } else {
              res.status(200).json(doc);
          }
        });
    });
    //===========================================================



    //===============PROJECTS DB ENDPOINTS========================
    app.get("/projects", function (req, res) {
        console.log("Project Query" , req.query);
        db.collection("projects").find(req.query).toArray(function (err, docs) {
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

        db.collection("projects").insertOne(newContact, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to create new contact.");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    });
    app.put("/projects/:id", function (req, res) {
        console.log("Update projects", req.body);
        db.collection("projects").updateOne({ _id: new ObjectID(req.params.id) }, {  $set: req.body }, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to update projects");
            } else {
                res.status(201).json(doc);
            }
        });
    });
    app.put("/projects/:id/participant/:participantId", function (req, res) {
        console.log("Update projects");
        db.collection("projects").updateOne({ _id: new ObjectID(req.params.id) }, {  $push: { participants: req.params.participantId } }, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to add participant to projects");
            } else {
                console.log("Added Participant");

                db.collection("notifications").updateOne({projectId: req.params.id , userId: req.params.participantId }, {  $set: { replied: true, answer: true } }, function (err, doc) {
                    if (err) {
                        handleError(res, err.message, "Failed to add participant to projects");
                    } else {
                        console.log("Update Notification");
                    }
                });

                res.status(201).json(doc);
            }
        });
    });
    app.delete("/projects/:id/participant/:participantId", function (req, res) {
        console.log("Deleting User");
        db.collection("projects").updateOne({ _id: new ObjectID(req.params.id) }, {  $pull: { participants: req.params.participantId } }, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to delete participant to projects");
            } else {
                console.log("Deleted Participant");
                db.collection("notifications").remove({projectId: req.params.id , userId: req.params.participantId }, function (err, doc) {
                    if (err) {
                        handleError(res, err.message, "Failed to add participant to projects");
                    } else {
                        console.log(" Notification Remove");
                    }
                });

                res.status(201).json(doc);
            }
        });
    });
    app.delete("/projects/:id", function (req, res) {
        db.collection("projects").remove({ _id: new ObjectID(req.params.id) }, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to delete Project");
            } else {
                res.status(200).json(doc);
            }
        });
    });
    //===============================================================



    //=================NOTIFICATIONS DB ENDPOINTS====================
    app.get("/notifications", function (req, res) {
        db.collection("notifications").find(req.query).toArray(function (err, docs) {
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

        db.collection("notifications").insertOne(newContact, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to create new contact.");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    });
    app.put("/notifications/:id", function (req, res) {
        console.log("Update Notification", req.body);
        db.collection("notifications").updateOne({ _id: new ObjectID(req.params.id) },  {  $set: req.body }, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to update User");
            } else {
                res.status(204).end();
            }
        });
    });
    //===============================================================


    app.post("/signup", function (req, res) {
        var postBody = req.body;
        console.log(postBody);

    });

});




module.export = {
    db: db
}
