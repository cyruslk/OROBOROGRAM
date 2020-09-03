const express = require("express");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const path = require("path");
const bodyParser = require('body-parser');
const http = require("http");
const https = require("https");
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 5000;
var app = express();
var Jimp = require("jimp");
var fs = require('fs');
var Twit = require('twit')
var T = new Twit(require('./config.js'))


app.use(express.static(__dirname + '/public'));
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

const imagesData = [];
let selectedEle = "";
let eleCommentCounts = "";


const originalImage = fs.readFileSync('original-img.jpg', {
    encoding: 'base64'
});
const imageToTweet = fs.readFileSync('altered-img.jpg', {
    encoding: 'base64'
});

const countComments = (eleUserName, eleTwitterId) => {
    T.get('search/tweets', { q: `to:{${eleUserName}}`, sinceId: eleTwitterId })
    .catch((err) => {console.log(err.stack)})
    .then((result) => {
      return result.data.statuses.length
    })
}

const runTheBot = () => {

  const arrayOfImages = [];
  T.get('search/tweets', { q: 'images', count: 100 })
    .catch(function (err) {
      console.log('caught error', err.stack)
    })
    .then((result) => {
      const data = result.data.statuses;

      return data.map((ele, index) => {
        if(ele.entities.media && ele.entities.user_mentions[0]){

           const elePath = ele.entities.media[0].media_url_https;
           const eleUserName = ele.entities.user_mentions[0].screen_name;
           const eleTwitterId = ele.id_str;
           const eleLikes = ele.favorite_count;
           const eleRetweets = ele.retweet_count;

           return imagesData.push({
              elePath: elePath,
              eleUserName: eleUserName,
              eleTwitterId: eleTwitterId,
              eleLikes: parseInt(eleLikes),
              eleRetweets: parseInt(eleRetweets),
            })
         }else{
           return;
         }
      })
    })
    .then(() => {
      selectedEle = imagesData[Math.floor(imagesData.length * Math.random())];
      return selectedEle
    })
    .then(() => {

      T.get('search/tweets', { q: `to:{${selectedEle.eleUserName}}`, sinceId: selectedEle.eleTwitterId })
      .catch((err) => {console.log(err.stack)})
      .then((result) => {

        let eleCommentCounts = result.data.statuses.length;
        selectedEle.eleCommentCounts = parseInt(eleCommentCounts);

        Jimp.read(selectedEle.elePath)
        .then(img => {
          return img
          .color([{ apply: 'red', params: [selectedEle.eleLikes] }])
          .color([{ apply: 'green', params: [selectedEle.eleRetweets] }])
          .color([{ apply: 'blue', params: [selectedEle.eleCommentCounts]}])
          .resize(600, 600)
            .write('altered-img.jpg');
        })
        .catch(err => {
          console.error(err);
        })
      })
     })
    .then(() => {
      return tweetTheModifiedImage(selectedEle)
  })
}

// make this in promises();
const tweetTheModifiedImage = (selectedEle) => {
  T.post('media/upload', {
    media: imageToTweet,
  }, (error, media, response) => {
      if(error){
        console.log(error);
      }
      if (!error) {
          let caption = `RGB(${selectedEle.eleLikes}, ${selectedEle.eleRetweets}, ${selectedEle.eleCommentCounts})`;
          let status = {
            status: caption,
            media_ids: media.media_id_string
          };
          T.post('statuses/update', status, function(error, tweet, response) {
              if (!error) {
                  console.log("Posted.");
              }
          });
      }
})};



runTheBot();

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
