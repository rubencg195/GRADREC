const express = require('express');
const app     = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
app.listen(3000, function() {
    console.log("Listening on 3000");
});

app.get('/', function(req, res){
    //response.sendFile('pages/home/index.html' , { root : __dirname});
    res.render('pages/home');
});

app.get('/login', function(request, response){
    response.send('Login');
});

app.get('/signup', function(request, response){
    response.send('Sign Up');
});