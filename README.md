# liri-node-app
LIRI is a _Language_ Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.

## Overview
This is command line app that will assist users by researching data based on 4 options:
* `concert-this` (This will show data from _bandsintown_ for upcoming concerts for a given performer.)
* `spotify-this-song` (This will show data from _Spotify_ for a given track.)
* `movie-this` (This will show data from _OMDB_ for a given movie title.)
* `do-what-it-says` (This will perform a search based on the text written in random.txt)

When liri.js is run, the user will receive the options above as a list. Use the arrow keys and return to select the desired command. If concert, song, or movie searches are selected, the user will be prompted with a second question to enter in a search term for the app to research. If no term is given, there are default searches or responses in place. If the search term yields results from the relevant api, the results will be shown in the console.

The log.txt file will serve as a search history file that tracks user input and the results printed in the console.

## Instructions
1. In CLI, enter 'node liri.js'
2. Use arrow keys and enter key to select one of the 4 available search options.
3. If there is a second question, type in a relevant search term for the question. Then press enter.
4. Observe results and feel free to check out log.txt.

For a video demonstration - https://drive.google.com/file/d/1DS_PP2eJV3AAEucfwSHAdtUMkBYkerkA/view

## Tech Used
* Node.js
* Dependencies noted in package.json
    - "axios": "^0.19.0",
    - "dotenv": "^7.0.0",
    - "inquirer": "^6.2.2",
    - "moment": "^2.24.0",
    - "node-spotify-api": "^1.0.7"


## Future Development
* I found a vulnerability with my result console logs. The results may refuse to print out if a successful api response simply doesn't have one of the data points. This issue was common for movie searches that don't have a Rotten Tomatoes rating. I added a conditional check to serve as a band-aid, but a dry-er solution may be needed.
