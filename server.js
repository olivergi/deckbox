/**
 * Created by iosdev on 29.3.2017.
 */
'use strict';

require('dotenv').config();
const express = require('express');
const DB = require('./database');
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const config = require('./config.js'),
    funct = require('./function.js');


const unirest = require('unirest');
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));

app.use(express.static('public'));


// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());

// ============= Routes =================
//displays the forum
app.get('/forum', ensureAuthenticated, (req, res) => {
    console.log('User : ');
    console.log(req.user);
    res.sendFile('forum.html', { root: 'public' });
});

//displays the postPage
app.get('/postPage', ensureAuthenticated, (req, res) => {
    res.sendFile('postPage.html', { root: 'public' });
});

//displays the homepage
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

//sends the request through the local signup strategy, and if successful takes user to forum, otherwise returns then to home page
app.post('/local-reg', passport.authenticate('local-signup', {
        successRedirect: '/forum',
        failureRedirect: '/'
    })
);

//sends the request through the local login/signin strategy, and if successful takes user to forum, otherwise returns then to home page
app.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/forum',
        failureRedirect: '/'
    })
);

//logs user out of site, deleting them from the session, and returns to homepage
app.get('/logout', (req, res) => {
    const name = req.user.username;
    console.log("LOGGIN OUT " + req.user.username);
    req.logout();
    res.redirect('/');
    req.session.notice = "You have successfully been logged out " + name + "!";
});

// ========== ROUTE END =============

// Hearthstone Card API -- For Searching
unirest.get('https://omgvamp-hearthstone-v1.p.mashape.com/cards')
    .header('X-Mashape-Key', process.env.mashape)
    .end((result) => {
        console.log('Server Running');
        const jsonData = JSON.stringify(result.body);
        const testData = '[' + jsonData + ']';

        fs.writeFile('public/data.json', testData, (err) => {
            if (err) {
                return console.log(err);
            }
        });

    });

DB.connect(process.env.mongoDB , app);

const forumPost = DB.getSchema(DB.postSchema, 'Post');

// ===== PASSPORT =====
// User Signin
passport.use('local-signin', new LocalStrategy(
    {passReqToCallback : true},
    (req, username, password, done) => {
        funct.localAuth(username, password)
            .then( (user) => {
                if (user) {
                    console.log('LOGGED IN AS: ' + user.username);
                    console.log(req.session);
                    req.session.success = 'You are successfully logged in ' + user.username;
                    done(null, user);
                }
                if (!user) {
                    console.log('COULD NOT LOG IN');
                    req.session.error = 'Could not log user in. Please try again.';
                    done(null, user);
                }
            })
            .fail( (err) => {
                console.log(err.body);
            });
    }
));

// Registration
passport.use('local-signup', new LocalStrategy(
    {passReqToCallback : true}, //enable pass back the request to the callback
    function(req, username, password, done) {
        funct.localReg(username, password)
            .then(function (user) {
                if (user) {
                    console.log('REGISTERED: ' + user.username);
                    req.session.success = 'You are successfully registered and logged in ' + user.username;
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

// add the user in session
passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log(user);
    done(null, user);
});

// === Passport End ===


// === User Authentication ===
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('User Authenticated');
        console.log(req.user);
        next();
    } else {
        req.session.error = 'Please sign in!';
        res.redirect('/');
    }
}

// === HTTPS Redirect === Removed for Jelastic Deployment

/* const sslkey = fs.readFileSync('ssl-key.pem');
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
 */

// ==== Forum Posts ====

// get posts
app.get('/posts', (req, res) => {
    forumPost.find().exec().then((posts) => {
        res.send({status: 'OK', post: posts});
    });
});

app.post('/editPost', (req, res) => {
    forumPost.findOneAndUpdate({_id : req.body.postId}, req.body.newPost, {new: true}, (err, update) => {
        if(!err) {
            res.send({status: true, update: update});
        } else {
            res.send({status: false, error: err});
        }
    });
});

app.delete('/deletePost', (req, res) => {
   forumPost.findOneAndRemove({_id: req.body.postId}, (err) =>{
       if(!err){
           res.send({status: true});
       } else {
           res.send({status: false, error: err});
       }
   })
});

// post
app.post('/post', (req, res, next) => {
    req.body.time = new Date().getTime();
    try {
        next();
    } catch (error) {
        res.send({status: 'error', message: 'EXIF error'});
    }
});

// add to DB
app.use('/post', (req, res, next) => {
    forumPost.create(req.body).then(post => {
        res.send({status: 'OK', post: post});
    }).catch((err) => {
        console.log('Error' + err);
    })
});

