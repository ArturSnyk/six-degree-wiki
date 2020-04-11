"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var axios = require("axios");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(4000);
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../index.html'));
});
app.get('/search', function (req, res) {
    var term = req.query.term;
    var url = "https://en.wikipedia.org/w/api.php";
    var params = {
        action: "query",
        list: "search",
        srsearch: "Nelson Mandela",
        format: "json"
    };
    url = url + "?origin=*";
    Object.keys(params).forEach(function (key) { url += "&" + key + "=" + params[key]; });
    var search = axios.get(url);
    then(function (response) { return response.json(); })
        .then(function (response) {
        if (response.query.search[0].title === "Nelson Mandela") {
            console.log("Your search page 'Nelson Mandela' exists on English Wikipedia");
        }
    })
        .catch(function (error) { console.log(error); });
    res.send("searching " + term);
});
