# Tiktok Scraper

This is a small little project I made for [HansumFella](https://hansumfella.com) (a Twitch streamer I work with). He gave me a list of all the usernames of everyone who follows him on TikTok (at the time it was like 350,000). He wanted a sorted list of his most followed followers. He just wanted to see the most famous people that followed him.

This seems like a pretty trivial task, however TikTok, at the time of writing this, doesn't have a public API, and all 3rd party ones are extremely expensive. So what I ended up doing is as follows

## Process
1. I made a function to make a GET request to `https://tiktok.com/@<USERNAME>`
2. I pulled out the HTML returned from that request and parsed it with Cheerio, a node package to parse HTML and use it like an object.
3. Then I had to find the part on the Tiktoks website where they list the follower count for a user, turns out they save it in a `<strong>` tag, and it was consistently placed throughout all profiles.
4. I got the value of this element easily -> `element.value`, however, Tiktok doesn't present follower counts as the whole number that they are, rather for larger users, they display it as something like 900K or 1.2M. This was a problem because even after I made a function to parse that to a full integer, it wasn't accurate down to the exact follower. So the best I could do was estimates.
5. Next, I stored a stringified JSON object in Redis as a set, as well as a separate KV pair for the current index. I did this because if I just made an array and pushed each object to it in memory, if the script crashed, I would lose all progress and all saved data, and have to fetch everything. Also, for the same reason, if the script crashed, I could use the index to pick up exactly where I left off.
6. Once that was all set and done, I just had to make a for loop and wait. And wait. And wait. And wait... It took a VERY long time. Part of the blame is because NodeJS is not the best language I could have picked and because Tiktok soft rate limits requests after a certain set request count. So if Tiktok delayed the response (since it was SSR), then I just had to wait a few seconds and try again. There were also ~300k requests I had to make.
7. After about 7 days of it running off and on, it finished. I had a pretty accurate array of all of his follower's follow counts. Next, I just had to sort it, that part was easy and took no time.

## After thoughts
Looking back on the project, I realize that I made a few mistakes and I see the ways I could have optimized it to go faster. I could (and should have) picked a faster, multi-threaded language. I could have perhaps split the total list to fetch into chunks and spawned multiple processes all working on different chunks. And I could have just written better code. 

This project is open source because I feel it was a good experience for me and I wanted to share it with the world, however, please do not contribute to the code. I know it is very messy and maybe one day I will fix it up and turn it into something bigger but for now, it is just a demo of how it can be done.

## Final product
Anyways, if you want to see the final product you can look at the sorted follower list as a txt file [Here](https://github.com/dickeyy/tiktok-scraper/blob/main/src/data/followers-sorted.txt) or JSON [Here](https://github.com/dickeyy/tiktok-scraper/blob/main/src/data/followers-sorted.json). 
I also made a list of all of his followers who, at the time of fetching, had 69 followers, that's [Here](https://github.com/dickeyy/tiktok-scraper/blob/main/src/data/followers-sorted.txt). Please note that the counts listed in these lists are likely no longer accurate as this data was statically fetched and is not consistently updated.
