const express = require('express');
const app     = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static( 'assets', {root: __dirname }));

//  use res.render to load up an ejs view file
app.listen(3331, function() {
    console.log("Listening on 3331");
});

app.get('/', function(req, res){
    //response.sendFile('pages/home/index.html' , { root : __dirname});
    res.render('pages/home');
});

app.get('/login', function(req, res){
    res.render('pages/login');
});

app.get('/signup', function(rq, res){
    res.render('pages/signup');
});

app.get('/profile', function(rq, res){
    res.render('pages/profile');
});

app.get('/projectCreation', function(rq, res){
    res.render('pages/projectCreation');
});

app.get('/dashboard', function(rq, res){
    res.render('pages/dashboard');
});


app.get('/research', function(rq, res){
    res.render('pages/research');
});

app.get('/studentSurvey', function(rq, res){
    res.render('pages/studentSurvey');
});
