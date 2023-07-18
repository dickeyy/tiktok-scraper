const fs = require('fs');

function sort() {

    console.time('timer');
    console.log('Sorting data...');

    // get all the followers in the file and get the follower counts that have a K in them
    let json = fs.readFileSync('./data/followers.json', 'utf8');
    let data = JSON.parse(json);
    let followerCounts = [];
    for (let i = 0; i < data.length; i++) {
        console.log(`Step 1: ${(i+1).toLocaleString()}/${data.length.toLocaleString()}`);
        let follower = JSON.parse(data[i]);
        let followerCount = follower.followerCount;
        if (followerCount.includes('K')) {
            followerCounts.push(followerCount);
        }
    }

    // each of the follower counts looks something like this: 1.2K or 12.3K or 123.4K, so we need to remove the K and convert the string to a number
    // we also want to get the usernames of the followers with the follower counts. there are 300,000+ followers, so we need to make sure we don't run out of memory and dont create infinite loops. Also, inorder for it to be a large follower count, it needs to have a decimal point, otherwise it could be 983, any thousands will have a decimal point

    // create an array to store the follower counts and usernames
    let followers = [];

    // loop through the follower counts
    for (let i = 0; i < followerCounts.length; i++) {
        console.log(`Step 2: ${(i+1).toLocaleString()}/${followerCounts.length.toLocaleString()}`);
        // get the follower count
        let followerCount = followerCounts[i];
        // remove the K
        followerCount = followerCount.replace('K', '');

        // check if the follower count has a decimal point
        if (!followerCount.includes('.')) {
            // if it doesn't, then it is not a large follower count, so we can skip it
            continue;
        }
        // convert the string to a number
        followerCount = parseFloat(followerCount);
        // get the username
        let username = '';
        // loop through the followers
        for (let j = 0; j < data.length; j++) {
            // get the follower
            let follower = JSON.parse(data[j]);
            // get the follower's follower count
            let followerCount2 = follower.followerCount;
            // remove the K
            followerCount2 = followerCount2.replace('K', '');
            // convert the string to a number
            followerCount2 = parseFloat(followerCount2);
            // check if the follower count matches the follower count we are looking for
            if (followerCount == followerCount2) {
                // get the username
                username = follower.username;
                // break out of the loop
                break;
            }
        }
        // add the follower count and username to the array
        followers.push({
            followerCount: followerCount,
            username: username,
            url: `https://www.tiktok.com/@${username}`
        })
    }

    // sort the array by follower count
    followers.sort((a, b) => {
        return b.followerCount - a.followerCount;
    })

    // save the array to a file
    let json2 = JSON.stringify(followers, null, 2);
    fs.writeFile('./data/followers-sorted.json', json2, 'utf8', (error) => {
        if (error) {
            console.log('Error writing to file');
        } else {
            console.log('Successfully wrote to file');
        }
    })

    console.timeEnd('timer');

}

sort()