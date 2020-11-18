const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
//mongoose.connect('mongodb:/localhost:27017/secretDB',
    //{useNewUrlParser: true, useUnifiedTopology: true});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/secrets', (req, res) => {
    res.render('secrets');
});

app.listen(3000, () =>{
    console.log('Server is running on port 3000');
})
