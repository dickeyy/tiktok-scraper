const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

let baseUrl = 'https://tiktok.com/@'

let i = 0;

let newArrayOfObjects = [];

// get the followers-formatted.json file
let json = fs.readFileSync('./data/followers-formatted.json', 'utf8');

// parse the json into an array of objects
let usernameData = JSON.parse(json);

// get the username from the first object
username = usernameData[0].username;

// start a timer
console.time('timer');

// get the html from the url
async function getFollowers(userparam, paramurl) {

    axios.get(paramurl).then((response) => {
        let html = response.data;
        let $ = cheerio.load(html);
    
        const arr = $("strong").toArray()

        let followers = $(arr[2]).text()
    
        if (followers == undefined || followers == null || followers == '' || followers == ' ') {
            console.log('Error getting followers for ' + userparam + ', trying again in 2 seconds');
            setTimeout(() => {
                getFollowers(userparam, paramurl)
            }, 2000);
        } else {
            // set the follower-count property of the object
            usernameData[i].followerCount = followers;

            // push the object to the new array
            newArrayOfObjects.push(usernameData[i]);

            // increment the counter
            i++;

            // call the loop function again
            loop();
        }
    
    });
}

// loop through the array of objects and get the followers for each one but only do one at a time, and wait for the previous one to finish
async function loop() {
    if (i < usernameData.length) {
        console.log(`${i+1}/${usernameData.length}`)

        let url = baseUrl + usernameData[i].username;
        let username = usernameData[i].username;

        // call the function to get the followers once it is done, call the loop function again
        await getFollowers(username, url);

    } else {
        fs.writeFileSync('./data/followers.json', JSON.stringify(newArrayOfObjects));
        console.log('\nDone');

        // stop the timer
        console.timeEnd('timer');
    }
}

loop();