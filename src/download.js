const { redis } = require('./redis');
const fs = require('fs');

function download() {
    let array = redis.sMembers("tiktok").then((array) => {
        console.log('Successfully got data from redis');
        let json = JSON.stringify(array, null, 2);
        fs.writeFile('./data/followers.json', json, 'utf8', (error) => {
            if (error) {
                console.log('Error writing to file');
            } else {
                console.log('Successfully wrote to file');
            }
        })
    }).catch((error) => {
        console.log(error);
        console.log('Error getting data from redis');
    })
}


redis.connect().then(() => {
    download()
}).catch((error) => {
    console.log('Error connecting to redis');
})