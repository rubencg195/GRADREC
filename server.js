const express = require('express');
const app     = express();

app.listen(3000, function() {
    console.log("Listening on 3000");
});

app.get('/', function(request, response){
    response.send('Hello World');
});

app.get('/login', function(request, response){
    response.send('Login');
});

app.get('/signup', function(request, response){
    response.send('Sign Up');
});