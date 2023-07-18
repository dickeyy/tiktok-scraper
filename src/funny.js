const fs = require('fs');

function funny() {

    // get all the followers in the file
    let json = fs.readFileSync('./data/followers.json', 'utf8');
    let data = JSON.parse(json);

    // each of the follower counts looks something like this: 12.3K or 123, so we need to remove the K and convert the string to a number
    // then we want to see if the follower count is 69
    // if it is, then we want to add it to an array
    // then we want to save the array to a file

    // create an array to store the followers
    let funny = [];

    // loop through the followers
    for (let i = 0; i < data.length; i++) {
        // get the follower
        let follower = JSON.parse(data[i]);
        // get the follower's follower count
        let followerCount = follower.followerCount;
        // remove the K
        followerCount = followerCount.replace('K', '');
        // convert the string to a number
        followerCount = parseFloat(followerCount);
        // check if the follower count is 69
        if (followerCount == 69) {
            // add the follower to the array
            funny.push(follower);
        }
    }

    // save the array to a file
    let json2 = JSON.stringify(funny, null, 2);
    fs.writeFile('./data/funny.json', json2, 'utf8', (error) => {
        if (error) {
            console.log('Error writing to file');
        } else {
            console.log('Successfully wrote to file');
        }
    })

    // format the array into a txt file
    let txt = '';
    for (let i = 0; i < funny.length; i++) {
        let follower = funny[i];
        txt += `${i+1}. @${follower.username}\n\n`;
    }

    // save the txt file
    fs.writeFile('./data/funny.txt', txt, 'utf8', (error) => {
        if (error) {
            console.log('Error writing to file');
        } else {
            console.log('Successfully wrote to file');
        }
    })

    console.log(funny.length)

}

funny()