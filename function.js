/**
 * Created by iosdev on 2.5.2017.
 */
const bcrypt = require('bcryptjs'),
    Q = require('q'),
    config = require('./config.js'); //config file contains all tokens and other private info

// MongoDB connection information
const mongodbUrl =  config.mongodbHost;
const MongoClient = require('mongodb').MongoClient;

//used in local-signup strategy
exports.localReg = function (username, password) {
    const deferred = Q.defer();

    MongoClient.connect(mongodbUrl, function (err, db) {
        const collection = db.collection('localUsers');

        //check if username is already assigned in our database
        collection.findOne({'username' : username})
            .then(function (result) {
                if (null != result) {
                    console.log("USERNAME ALREADY EXISTS:", result.username);
                    deferred.resolve(false); // username exists
                }
                else  {
                    const hash = bcrypt.hashSync(password, 8);
                    const user = {
                        "username": username,
                        "password": hash
                    };

                    console.log("CREATING USER:", username);

                    collection.insert(user)
                        .then(function () {
                            db.close();
                            deferred.resolve(user);
                        });
                }
            });
    });

    return deferred.promise;
};


//check if user exists
//if user exists check if passwords match (use bcrypt.compareSync(password, hash); // true where 'hash' is password in DB)
//if password matches take into website
//if user doesn't exist or password doesn't match tell them it failed
exports.localAuth = function (username, password) {
    const deferred = Q.defer();

    MongoClient.connect(mongodbUrl, function (err, db) {
        const collection = db.collection('localUsers');

        collection.findOne({'username' : username})
            .then(function (result) {
                if (null == result) {
                    console.log("USERNAME NOT FOUND:", username);

                    deferred.resolve(false);
                }
                else {
                    const hash = result.password;

                    console.log("FOUND USER: " + result.username);

                    if (bcrypt.compareSync(password, hash)) {
                        deferred.resolve(result);
                    } else {
                        console.log("AUTHENTICATION FAILED");
                        deferred.resolve(false);
                    }
                }

                db.close();
            });
    });

    return deferred.promise;
};