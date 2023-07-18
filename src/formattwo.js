const fs = require('fs');

function formatagain() {

    // get the sorted followers
    let json = fs.readFileSync('./data/followers-sorted.json', 'utf8');
    let data = JSON.parse(json);

    // now make the data into a easy readable txt file
    let txt = '';
    for (let i = 0; i < data.length; i++) {
        let follower = data[i];
        txt += `${i+1}. @${follower.username} - ${follower.followerCount}K Followers\nURL: ${follower.url}\n\n`;
    }

    // save the txt file
    fs.writeFile('./data/followers-sorted.txt', txt, 'utf8', (error) => {
        if (error) {
            console.log('Error writing to file');
        } else {
            console.log('Successfully wrote to file');
        }
    })

}

formatagain()