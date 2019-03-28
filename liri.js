// requirements and package set-ups

require("dotenv").config();
var axios = require("axios")
var moment = require('moment');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var inquirer = require('inquirer');


// first question
inquirer.prompt(
    {
        type: "list",
        message: "Which type of search do you want to perform?",
        choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "command"
    }
)
    .then(answers => {
        writeCommand(answers.command)
        // declare a variable to customize second prompt
        var topic = ""
        switch (answers.command) {
            // assign topic and run 2nd question
            case "concert-this": topic = "performer"; secondPrompt();
                break;
            case "spotify-this-song": topic = "song title"; secondPrompt();
                break;
            case "movie-this": topic = "movie title"; secondPrompt();
                break;
            // immediately read the text file
            case "do-what-it-says": readText();
                break;
            default: console.log("Please choose concert-this, spotify, or something else");
        }
        // define function to generate second question based on first answer
        function secondPrompt() {
            inquirer.prompt({
                type: "input",
                message: `Please enter the ${topic} that you want to search.`,
                name: "term"
            }
            ).then(answers => {
                writeTerm(answers.term)
                // run a search func based on the answer and tailored message
                switch (topic) {
                    case "performer": concert(answers.term);
                        break;
                    case "song title": song(answers.term);
                        break;
                    case "movie title": movie(answers.term);
                        break;
                    default: console.log("How did you trigger this message!? Please provide steps at https://github.com/nikorasu-san/liri-node-app.");
                }
            })
        }

    });

// define functions
function concert(artist) {
    // input validator
    if (!artist) {
        var message = "Sorry. I didn't catch that. Can you run this again and give me an artist for the search?"
        console.log(message)
        return message
    }
    // ping bandsintown api
    let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(function (response) {
        // check if there are concerts in the successful return
        if (!response.data[0]) {
            console.log("We couldn't find any upcoming shows.")
        }
        // loop the response.data
        for (var i = 0; i < response.data.length; i++) {
            let venue = response.data[i].venue.name;
            let address = response.data[i].venue.city + ", " + response.data[i].venue.region + " " + response.data[i].venue.country;
            let date = moment(response.data[i].datetime).format("MM/DD/YYYY")
            let result = `//-----Concert ${i + 1} of ${response.data.length}----- \b\n Venue: ${venue} \b\n Location: ${address} \b\n Date: ${date}`
            console.log(result);
            writeResult(result);
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
            // check for any valid results
            if (!response.tracks.items[0]) {
                console.log("Sorry. We couldn't find any songs.")
            }
            for (var i = 0; i < response.tracks.items.length; i++) {
                // print elements the results array in console and txt
                let result = `//---Track Result ${i + 1} of ${response.tracks.items.length}--- \b\n Artist: ${response.tracks.items[i].artists[0].name} \b\n Song: ${response.tracks.items[i].name} \b\n Album: ${response.tracks.items[i].album.name} \b\n Spotify link: ${response.tracks.items[i].external_urls.spotify} \b\n Preview link: ${response.tracks.items[i].preview_url}`
                console.log(result);
                writeResult(result);
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function movie(title) {
    // input validator
    if (!title) {
        title = "Mr. Nobody";
    }
    // ping OMDB api
    var url = "http://www.omdbapi.com/?apikey=trilogy&type=movie&t=" + title;
    axios.get(url).then(function (response) {
        // check if there are concerts in the successful return
        if (response.data.Response === 'False') {
            var result = "We couldn't find any movie titles."
            console.log(result)
            writeResult(result);
        } else {
            // found that not having a Rotten T score often broke my results variable 
            if (!response.data.Ratings[1]) {
                var result = `Title: ${response.data.Title} \b\nYear: ${response.data.Year} \b\nIMDB Rating: ${response.data.Ratings[0].value} \b\nRotten Tomatoes Rating: not found. \b\nCountry: ${response.data.Country} \b\nLanguage: ${response.data.Language} \b\nPlot: ${response.data.Plot} \b\nActors: ${response.data.Actors}`;
            } else {
                var result = `Title: ${response.data.Title} \b\nYear: ${response.data.Year} \b\nIMDB Rating: ${response.data.Ratings[0].value} \b\nRotten Tomatoes Rating: ${response.data.Ratings[1].value} \b\nCountry: ${response.data.Country} \b\nLanguage: ${response.data.Language} \b\nPlot: ${response.data.Plot} \b\nActors: ${response.data.Actors}`;
            }
            // print data points from response
            console.log(result);
            writeResult(result);
        }
    }).catch(function (error) {
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

// functions to append user actions and results to the log.txt
function writeCommand(command) {
    fs.appendFile('log.txt', `${command},`, (err) => {
        if (err) throw err;
    });
}

function writeTerm(term) {
    fs.appendFile('log.txt', `${term}\b\n`, (err) => {
        if (err) throw err;
    });
}

function writeResult(result) {
    fs.appendFile('log.txt', `${result}\b\n`, (err) => {
        if (err) throw err;
    });
}