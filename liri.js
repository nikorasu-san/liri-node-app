require("dotenv").config();
var moment = require('moment');
moment().format();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

console.log(keys)