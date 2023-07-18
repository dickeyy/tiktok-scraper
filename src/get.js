const fs = require('fs');

function get() {

    // get one of the followers in the file
    let json = fs.readFileSync('./data/followers.json', 'utf8');
    let data = JSON.parse(json);
    let random = Math.floor(Math.random() * data.length);
    let follower = data[random];

    follower = JSON.parse(follower);

    // get the follower's username
    let username = follower.username;

    // get the follower's follower count
    let followerCount = follower.followerCount;

    console.log(`Username: ${username} - Follower Count: ${followerCount}`);

}

get()