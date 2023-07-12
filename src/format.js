const fs = require('fs');

//  get the raw data
let raw = fs.readFileSync('./data/followers-raw.txt', 'utf8');

// split the raw data into an array of strings
let rawArray = raw.split('\n');

// in the txt each follower has this format:
// Date: 2020-01-01 00:00:00
// Username: username
// \n

// so we can loop through the array and grab the username
// we don't need the date, so we can skip every other line
let formattedArray = [];
for (let i = 0; i < rawArray.length; i += 3) {
    let username = rawArray[i + 1].split(' ')[1];
    formattedArray.push(username);
}

// now we have an array of usernames, we can loop through
// and create the format object for each one
let formattedJSON = [];
for (let i = 0; i < formattedArray.length; i++) {
    let format = {
        "username": formattedArray[i],
        "followerCount": null,
    }
    formattedJSON.push(format);
}

// now we can write the formattedJSON to a file
fs.writeFileSync('./data/followers-formatted.json', JSON.stringify(formattedJSON));

console.log('Formatted JSON written to file');