const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// connect to redis
const { redis } = require('./redis');

// set the base url
let baseUrl = 'https://tiktok.com/@'

// set initial counter
let i = 0;

// get the followers-formatted.json file
let json = fs.readFileSync('./data/followers-formatted.json', 'utf8');

// parse the json into an array of objects
let usernameData = JSON.parse(json);
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

            // save the object to redis
            redis.sAdd('tiktok', JSON.stringify(usernameData[i])).then(() => {
                // increment the counter
                i++;
                // save the index to redis so we can pick up where we left off if the script stops
                redis.set('index', i).then(() => {
                    console.log(`${i+1}/${usernameData.length} - ${followers} saved`)
                    // call the loop function again
                    loop();
                }).catch((error) => {
                    console.log('Error saving index to redis');
                })
            }).catch((error) => {
                console.log('Error saving ' + userparam + ' to redis');
            })
        }
    
    }).catch((error) => {
        // check if the error is a 404
        if (error.response.status == 404) {
            // skip this user
            console.log('Error 404 for ' + userparam + ', skipping');
            i++;
            loop();
        } else {
            console.log(`Error ${error.response.status} for ${userparam}, trying again in 2 seconds`);
            setTimeout(() => {
                getFollowers(userparam, paramurl)
            }, 2000);
        }
    })
}

// loop through the array of objects and get the followers for each one but only do one at a time, and wait for the previous one to finish
async function loop() {
    // get the index from redis
    redis.get('index').then((index) => {
        if (index == null) {
            i = 0;
        } else {
            i = index;
        }
    }).catch((error) => {
        console.log('Error getting index from redis');
    })
    if (i < usernameData.length) {

        let username = usernameData[i].username;
        let url = baseUrl + username;

        // call the function to get the followers once it is done, call the loop function again
        await getFollowers(username, url);

    } else {

        // we are done, save the json to a file
        fs.writeFileSync('./data/followers.json', JSON.stringify(usernameData));

        console.log('\nDone');

        // stop the timer
        console.timeEnd('timer');
    }
}

redis.connect().then(() => {
    console.log('Connected to redis');

    // start the loop
    loop();
})