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
    res.status(200).json(stacktrace + msg).end();
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
        res.render('pages/dashboard', { query: req.query });
    });
    app.get('/login', function (req, res) {
        res.render('pages/login');
    });
    app.get('/signup', function (req, res) {
        res.render('pages/signup');
    });
    app.get('/profile', function (req, res) {
        res.render('pages/profile', { query: req.query });
    });
    app.get('/projectCreation', function (req, res) {
        res.render('pages/projectCreation', { query: req.query });
    });
    app.get('/dashboard', function (req, res) {
        res.render('pages/dashboard', { query: req.query });
    });
    app.get('/messages', function (req, res) {
        res.render('pages/messages', { query: req.query });
    });
    app.get('/notification', function (req, res) {
        res.render('pages/notifications', { query: req.query });
    });
    app.get('/research', function (req, res) {  // GET /research?id=5
        res.render('pages/research', { query: req.query });
    });
    app.get('/studentSurvey', function (req, res) {
        res.render('pages/studentSurvey', { query: req.query });
    });
    app.get('/chat', function (req, res) {
        res.render('pages/chat', { query: req.query });
    });
    //===========================================================



    //=============USER DB ENDPOINTS==============================
    app.get("/users", function (req, res) {
        console.log("User Query", req.query);
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
        db.collection("users").updateOne({ _id: new ObjectID(req.params.id) }, { $set: req.body }, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to get contact");
            } else {
                res.status(200).json(doc);
            }
        });
    });
    //===========================================================
    app.get("/projects", function (req, res) {
        console.log("GET PROJECTS", req.query);
        db.collection("projects").aggregate([
            { "$match": req.query },
            {
                "$lookup": {
                    "from": "users",
                    "foreignField": "_id",
                    "localField": "participants",
                    "as": "participantsData"
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "foreignField": "_id",
                    "localField": "managerId",
                    "as": "managerData"
                }
            }
        ]).toArray(function (err, projects) {
            if (err) {
                handleError(res, err.message, "Failed to get contacts.");
            } else {
                console.log("GETTING PROJECTS");
                projects.forEach(proj => {
                    proj.managerData = (proj.managerData.length > 0)? proj.managerData[0] : null;
                });
                res.status(200).json(projects);
            }
        });
    });

    app.get("/projects/:id", function (req, res) {
        // db.collection("projects").findOne({ _id: new ObjectID(req.params.id) }, function (err, doc) {
        //     if (err) {
        //         handleError(res, err.message, "Failed to get contact");
        //     } else {
        //         console.log("GETTING PROJECTS", doc);
        //         res.status(200).json(doc);
        //     }
        // });

        console.log("GET PROJECT", { _id: new ObjectID(req.params.id) } );
        db.collection("projects").aggregate([
            { "$match": { _id: new ObjectID(req.params.id) }  },
            {
                "$lookup": {
                    "from": "users",
                    "foreignField": "_id",
                    "localField": "participants",
                    "as": "participantsData"
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "foreignField": "_id",
                    "localField": "managerId",
                    "as": "managerData"
                }
            },
            {
                "$lookup": {
                    "from": "notifications",
                    "foreignField": "projectId",
                    "localField": "_id",
                    "as": "notificationsData"
                }
            }
        ]).toArray(function (err, projects) {
            if (err) {
                handleError(res, err.message, "Failed to get contacts.");
            } else {
                var proj = projects.length > 0 ? projects[0] : null;
                proj.managerData = (proj && proj.managerData.length > 0)? proj.managerData[0] : null;
                console.log("GETTING PROJECTS", proj);
                if(req.query.getNotifications){
                    var userId = req.query.userId;
                    if(proj){
                        proj.notificationsData =  proj.notificationsData.filter(not => not.type== "APPLY_REQUEST" && not.userId ==  userId );
                    }

                }else{

                }

                res.status(200).json( proj );
            }
        });
    });
    app.post("/projects", function (req, res) {
        var newProject = req.body;
        newProject.createDate = new Date();
        newProject.managerId = new ObjectID(newProject.managerId);

        db.collection("projects").insertOne(newProject, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to create new contact.");
            } else {
                console.log("POSTING PROJECTS", doc.ops[0]);
                res.status(201).json(doc.ops[0]);
            }
        });
    });
    app.put("/projects/:id", function (req, res) {
        console.log("Update projects", req.body);
        var newProject = req.body;
        newProject.managerId = new ObjectID(newProject.managerId);

        db.collection("projects").updateOne({ _id: new ObjectID(req.params.id) }, { $set: newProject }, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to update projects");
            } else {
                res.status(201).json(doc);
            }
        });
    });
    app.put("/projects/:id/participant/:participantId", function (req, res) {
        console.log("Update projects");
        db.collection("projects").updateOne({ _id: new ObjectID(req.params.id) }, { $push: { participants: new ObjectID(req.params.participantId) } }, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to add participant to projects");
            } else {
                console.log("Added Participant");

                db.collection("notifications").updateOne({ projectId: new ObjectID(req.params.id), userId: new ObjectID(req.params.participantId) }, { $set: { replied: true, answer: true } }, function (err, doc) {
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
        db.collection("projects").updateOne({ _id: new ObjectID(req.params.id) }, { $pull: { participants:  new ObjectID(req.params.participantId) } }, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to delete participant to projects");
            } else {
                console.log("Deleted Participant");
                db.collection("notifications").remove({ projectId: new ObjectID(req.params.id), userId: new ObjectID(req.params.participantId) }, function (err, doc) {
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
        var newNot = req.body;
        newNot.createDate = new Date();

        if(newNot.type == "APPLY_REQUEST"){
            newNot.projectId        =  new ObjectID(newNot.projectId) ;
            newNot.userId           = new ObjectID(newNot.userId) ;
            newNot.projectManagerId = new ObjectID(newNot.projectManagerId) ;
        }else{
            newNot.origin             = new ObjectID(newNot.origin );
            newNot.to                 = new ObjectID(newNot.to);
            newNot.from               = new ObjectID(newNot.from);
            newNot.projectId          = new ObjectID(newNot.projectId);
            newNot.projectManagerId   = new ObjectID(newNot.projectManagerId);
        }


        db.collection("notifications").insertOne(newNot, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to create new contact.");
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    });
    app.put("/notifications/:id", function (req, res) {
        console.log("Update Notification", req.body);

        var newNot = req.body;
        newNot.createDate = new Date();

        if(newNot.type == "APPLY_REQUEST"){
            newNot.projectId        =  new ObjectID(newNot.projectId) ;
            newNot.userId           = new ObjectID(newNot.userId) ;
            newNot.projectManagerId = new ObjectID(newNot.projectManagerId) ;
        }else{
            newNot.origin             = new ObjectID(newNot.origin );
            newNot.to                 = new ObjectID(newNot.to);
            newNot.from               = new ObjectID(newNot.from);
            newNot.projectId          = new ObjectID(newNot.projectId);
            newNot.projectManagerId   = new ObjectID(newNot.projectManagerId);
        }

        db.collection("notifications").updateOne({ _id: new ObjectID(req.params.id) }, { $set: newNot }, function (err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to update User");
            } else {
                res.status(204).end();
            }
        });
    });
    //===============================================================

    //========================= CONVERSATION ==============================
    app.get("/conversation/:originId/projectId/:projectId", function (req, res) {
        console.log("Conversation Query", req.query, req.params);
        db.collection("notifications").aggregate([
            { "$match":  {
                "origin" : new ObjectID(req.params.originId) ,
                "projectId" : new ObjectID(req.params.projectId) ,
                "type" : "MESSAGE"
            }},
            {
                "$lookup": {
                    "from": "users",
                    "foreignField": "_id",
                    "localField": "participants",
                    "as": "participantsData"
                }
            }
        ]).toArray(function (err, docs) {
            if (err) {
                handleError(res, err.message, "Failed to get contacts.");
            } else {
                console.log("GETTING PROJECTS");
                res.status(200).json(docs);
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
