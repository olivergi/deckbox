/**
 * Created by iosdev on 29.3.2017.
 */
'use strict';

require('dotenv').config();
const DB = require('./database');
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const exphbs = require('express-handlebars');
const config = require('./config.js'),
    funct = require('./function.js');


const unirest = require('unirest');
const express = require('express');
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));

app.use(express.static('public'));

// Session-persisted message middleware
app.use(function(req, res, next){
    const err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;

    next();
});

// Configure express to use handlebars templates
const hbs = exphbs.create({
    defaultLayout: 'main', //we will be creating this layout shortly
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// ============= Routes =================

//displays our homepage
app.get('/', function(req, res){
    res.render('home', {user: req.user});
    ensureAuthenticated();
});

//displays our signup page
app.get('/signin', function(req, res){
    res.render('signin');
});

//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.post('/local-reg', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signin'
    })
);

//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/',
        failureRedirect: '/signin'
    })
);

//logs user out of site, deleting them from the session, and returns to homepage
app.get('/logout', function(req, res){
    const name = req.user.username;
    console.log("LOGGIN OUT " + req.user.username);
    req.logout();
    res.redirect('/');
    req.session.notice = "You have successfully been logged out " + name + "!";
});

// ========== ROUTE END =============

// Optional Parameters: ?attack=1&cost=1&health=1
unirest.get('https://omgvamp-hearthstone-v1.p.mashape.com/cards')
    .header('X-Mashape-Key', process.env.mashape)
    .end((result) => {
        console.log('Server Running');
        const jsonData = JSON.stringify(result.body);
        const testData = '[' + jsonData + ']';

        fs.writeFile('public/data.json', testData, function (err) {
            if (err) {
                return console.log(err);
            }
        });

    });

DB.connect(process.env.mongoDB , app);

const forumPost = DB.getSchema(DB.postSchema, 'Post');

/* passport.use(new LocalStrategy(
    (username, password, done) => {
        if (username !== process.env.username || password !== process.env.password) {
            return done(null, false, {message: 'Incorrect credentials.'});
        }
        return done(null, {username: username});
    }
)); */

//===============PASSPORT=================
// Use the LocalStrategy within Passport to login/"signin" users.
passport.use('local-signin', new LocalStrategy(
    {passReqToCallback : true}, //allows us to pass back the request to the callback
    function(req, username, password, done) {
        funct.localAuth(username, password)
            .then(function (user) {
                if (user) {
                    console.log("LOGGED IN AS: " + user.username);
                    req.session.success = 'You are successfully logged in ' + user.username + '!';
                    done(null, user);
                }
                if (!user) {
                    console.log("COULD NOT LOG IN");
                    req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
                    done(null, user);
                }
            })
            .fail(function (err){
                console.log(err.body);
            });
    }
));
// Use the LocalStrategy within Passport to register/"signup" users.
passport.use('local-signup', new LocalStrategy(
    {passReqToCallback : true}, //allows us to pass back the request to the callback
    function(req, username, password, done) {
        funct.localReg(username, password)
            .then(function (user) {
                if (user) {
                    console.log('REGISTERED: ' + user.username);
                    req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
                    done(null, user);
                }
                if (!user) {
                    console.log('COULD NOT REGISTER');
                    req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
                    done(null, user);
                }
            })
            .fail(function (err){
                console.log(err.body);
            });
    }
));

//add the user in session
passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log(user);
    done(null, user);
});

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { return next(); }
    req.session.error = 'Please sign in!';
    res.redirect('/signin');
};

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');

const options = {
    key: sslkey,
    cert: sslcert
};

https.createServer(options, app).listen(3000);
http.createServer((req, res) => {
    res.writeHead(301, {'Location': 'https://localhost:3000' + req.url});
    res.end();
}).listen(8080);

app.get('/*', (req, res) => {
    if (req.user == undefined) {
        res.redirect('/index.html')
    }
});

/* app.post('/login',
    passport.authenticate('local', {successRedirect: '/forum.html', failureRedirect: '/'})
); */

// get posts
app.get('/posts', (req, res) => {
    forumPost.find().exec().then((posts) => {
        res.send({status: 'OK', post: posts});
    });
});

// post
app.post('/post', (req, res, next) => {
    console.log(JSON.stringify(req.body));
    req.body.time = new Date().getTime();
    console.log('Req Body Title:' + req.body.title);
    try {
        next();
    } catch (error) {
        console.log('Error: ' + error.message);
        res.send({status: 'error', message: 'EXIF error'});
    }
});

// add to DB
app.use('/post', (req, res, next) => {
    forumPost.create(req.body).then(post => {
        res.send({status: 'OK', post: post});
    }).then(() => {
        res.send({status: 'error', message: 'Database error'});
    });
});

