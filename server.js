/**
 * Created by iosdev on 29.3.2017.
 */
"use strict";

const unirest = require('unirest');
const express = require('express');
const fs = require("fs");
const app = express();

app.listen(3000);

app.use(express.static('public'));

// Optional Parameters: ?attack=1&cost=1&health=1

unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards")
    .header("X-Mashape-Key", "ZKV1bthqaemshupcn0VO0b4A7tXLp1PeXxAjsnMmW4jG7fVeVO")
    .end((result) => {
        //console.log(result.status, result.headers, result.body);
        console.log("WOW AMAZING: " + result.body.Basic[1].img);

        const jsonData = JSON.stringify(result.body);
        const testData = "[" + jsonData + "]";

        fs.writeFile("public/data.json", testData, function(err) {
            if(err) {
                return console.log(err);
            }
        });

    });







