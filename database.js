/**
 * Created by iosdev on 28.4.2017.
 */
'use strict';

class Database {
    constructor() {
        this.mongoose = require('mongoose');
        this.mongoose.Promise = global.Promise; //ES6 Promise
        this.postSchema = {
            time: Date,
            title: String,
            postText: String
        };
    };

    connect(url, app) {
        this.url = url;
        this.app = app;
        this.mongoose.connect(this.url).then(() => {
            console.log('Connected to Mongo');
            this.app.listen(3000);
        }, (err) => {
            console.log(err.message);
            console.error('Connecting to Mongo failed');
        });
    };

    getSchema(schema, name) {
        const s = new this.mongoose.Schema(schema);
        return this.mongoose.model(name, s);
    }

}
module.exports = new Database();