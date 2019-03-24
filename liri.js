// requirements and package set-ups

require("dotenv").config();
var axios = require("axios")
var moment = require('moment');
moment().format();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

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
    case "do-what-it-says": readText();
        break;
    default: console.log("plz choose concert-this, spotify, or something else");
}

// define functions

function concert(artist) {
    // input validator
    if (!artist) {
        var message = "Did you give me an artist to search for?"
        console.log(message)
        return message
    }
    // create bandsintown api url
    let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(function (response) {
        // loop the response.data
        for (var i = 0; i < response.data.length; i++) {
            let venue = response.data[i].venue.name;
            let address = response.data[i].venue.city + ", " + response.data[i].venue.region + " " + response.data[i].venue.country
            let date = moment(response.data[i].datetime).format("MM/DD/YYYY")
            console.log(`//---Concert ${i + 1} of ${response.data.length}---`)
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
    // input validator
    if (!input) {
        input = "The Sign"
    }
    // ping Spotify
    spotify.search({ type: 'track', query: input })
        .then(function (response) {
            for (var i = 0; i < response.tracks.items.length; i++) {
                console.log(`//---Track Result ${i + 1} of ${response.tracks.items.length}---`)
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

function movie(title) {
    // input validator
    if (!title) {
        title = "Mr.+Nobody";
    }
    var url = "http://www.omdbapi.com/?apikey=trilogy&type=movie&t=" + title;
    axios.get(url).then(function (response) {
        console.log("Title: ", response.data.Title);
        console.log("Year: ", response.data.Year);
        console.log("IMDB Rating: ", response.data.Ratings[0].value);
        console.log("Rotten Tomatoes Rating: ", response.data.Ratings[1].value);
        console.log("Country: ", response.data.Country);
        console.log("Language: ", response.data.Language);
        console.log("Plot: ", response.data.Plot);
        console.log("Actors: ", response.data.Actors);
    })
        .catch(function (error) {
            console.log(error);
        });
}

function readText() {
    // read file
    fs.readFile('./random.txt', 'utf8', function (err, data) {
        if (err) throw err;
        console.log(data);
        // identify command and term
        var fileInput = data.split(",");
        // conditional to run command and term
        switch (fileInput[0]) {
            case "concert-this": concert(fileInput[1]);
                break;
            case "spotify-this-song": song(fileInput[1]);
                break;
            case "movie-this": movie(fileInput[1]);
                break;
            default: console.log("The text file doesn't include a valid command and search term syntax: concert-this,\"performer name\"; spotify-this-song,\"song title\"; or movie-this,\"movie  title\"");
        }
    });
}

