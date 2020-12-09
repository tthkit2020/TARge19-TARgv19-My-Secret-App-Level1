require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const md5 = require('md5');
const session = require('express-session');
const passport = require('passport');
const passportlocalMongoose = require('passport-local-mongoose');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
//initialize session

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(`mongodb://${process.env.DB_SERVER}:27017/secretDB`, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportlocalMongoose);

//const secret = 'thisismysupersecretkey';
//userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    User.register({username: req.body.username}, req.body.password, (error, user) => {
        if(error){
            console.log(error);
            res.redirect('/register');
        } else {
            passport.authenticate('local')(req, res, () =>{
                res.redirect('/secrets');
            });
        }
    });

});


app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const userName = req.body.username;
    const password = md5(req.body.password);

    User.findOne({
        email: userName,
        password: password
    }, (error, userFound)=>{
        if(error){
            console.log(error);
        } else{
            if(userFound){
                res.render('secrets');
            } else {
                res.render('login');
            }
        }
    });

});


app.listen(3000, () =>{
    console.log('Server is running on port 3000');
})
