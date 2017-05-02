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

const unirest = require('unirest');
const express = require('express');
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));

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

passport.use(new LocalStrategy(
    (username, password, done) => {
        if (username !== process.env.username || password !== process.env.password) {
            return done(null, false, {message: 'Incorrect credentials.'});
        }
        return done(null, {username: username});
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

app.post('/login',
    passport.authenticate('local', {successRedirect: '/forum.html', failureRedirect: '/'})
);

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

