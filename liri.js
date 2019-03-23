// requirements and package set-ups

require("dotenv").config();
var axios = require("axios")
var moment = require('moment');
moment().format();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// define user input 
var command = process.argv[2];
var term = process.argv[3];

// conditional
switch (command) {
    case "concert-this": concert(term);
        break;
    case "spotify-this-song": song(term);
        break;
    case "movie-this": movie(term);
        break;
    case "do-what-it-says": console.log("rando");
        break;
    default: console.log("plz choose concert-this, spotify, or something else");
}

// define functions

function concert(artist) {
    // create api url
    let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(function (response) {
        // loop the response.data
        for (var i = 0; i < response.data.length; i++) {
            let venue = response.data[i].venue.name;
            let address = response.data[i].venue.city + ", " + response.data[i].venue.region + " " + response.data[i].venue.country
            let date = moment(response.data[i].datetime).format("MM/DD/YYYY")
            console.log(`---Concert ${i + 1} of ${response.data.length}---`)
            console.log("Venue: ", venue)
            console.log("Location: ", address)
            console.log("Date: ", date)
            // console.log(`-----------------------------`)
        }
    })
        .catch(function (error) {
            console.log(error);
        });
}

function song(input) {

    spotify.search({ type: 'track', query: input })
        .then(function (response) {
            for (var i = 0; i < response.tracks.items.length; i++) {
                console.log(`---Track Result ${i + 1} of ${response.tracks.items.length}---`)
                console.log("artist: ", response.tracks.items[i].artists[0].name);
                console.log("song: ", response.tracks.items[i].name);
                console.log("album: ", response.tracks.items[i].album.name);
                console.log("preview link: ", response.tracks.items[i].external_urls.spotify);
                console.log("open spotify: ", response.tracks.items[i].preview_url);
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function movie() {
    axios.get("http://www.omdbapi.com/?apikey=[yourkey]&")
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

