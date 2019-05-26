const express = require("express");
const path = require("path");
const socketIO = require("socket.io")
const http = require("http");
const https = require("https");
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
var _ = require('lodash');
var request = require("request");
var conv = require('binstring');
var webshot = require('webshot');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var Jimp = require("jimp");
var fs = require('fs');
var Twit = require('twit')
var T = new Twit(require('./config.js'))


const imagesData = [];
const imageToTweet = fs.readFileSync('altered-img.jpg', {
    encoding: 'base64'
});

const runTheBot = () => {
  const arrayOfImages = [];
  T.get('search/tweets', { q: 'images', count: 100 })
    .catch(function (err) {
      console.log('caught error', err.stack)
    })
    .then(function (result) {

      const data = result.data.statuses;

      return data.map((ele, index) => {
        if(ele.entities.media){
           const elePath = ele.entities.media[0].media_url_https;
            return imagesData.push({
              elePath: elePath,
              userFollowers: ele.user.followers_count,
              userLikes: ele.user.friends_count
            })
         }else{
           return;
         }
      })
    })
    .then(() => {
      let selectedEle =  imagesData[Math.floor(imagesData.length * Math.random())];
      console.log(selectedEle);

      Jimp.read(selectedEle.elePath)
      .then(img => {
        return img
        .blur(selectedEle.userFollowers)
        .color([{ apply: 'hue', params: [ selectedEle.userLikes]}])
        .resize(600, 600)
          .write('altered-img.jpg');
      })
      .catch(err => {
        console.error(err);
      })
      .then(() => {
        return tweetTheModifiedImage(selectedEle);
      })
  })
}



tweetTheModifiedImage = (selectedEle) => {

  T.post('media/upload', {
        media: imageToTweet
    }, function(error, media, response) {
        if(error){
          console.log(error);
        }
        if (!error) {
            var status = {
                status: `${selectedEle.userFollowers}, ${selectedEle.userLikes}`,
                media_ids: media.media_id_string // Pass the media id string
            }
            T.post('statuses/update', status, function(error, tweet, response) {
                if (!error) {
                    console.log("Posted.");
                }
            });
        }
    });
  }



runTheBot();


server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
