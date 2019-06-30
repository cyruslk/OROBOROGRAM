const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const http = require("http");
const https = require("https");
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 5000;

const mongo = require('mongodb').MongoClient
const connectionURL = 'mongodb://localhost:27017'


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
const originalImage = fs.readFileSync('original-img.jpg', {
    encoding: 'base64'
});
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
      console.log(data[0]);

      return data.map((ele, index) => {
        if(ele.entities.media){
           const elePath = ele.entities.media[0].media_url_https;
            return imagesData.push({
              elePath: elePath,
              userFollowers: ele.user.followers_count,
              userLikes: ele.user.friends_count
            })
            // console.log(imagesData);
         }else{
           return;
         }
      })
    })
    .then(() => {
      let selectedEle =  imagesData[Math.floor(imagesData.length * Math.random())];
      // console.log(selectedEle);
      Jimp.read(selectedEle.elePath)
      .then(img => {
        return img
        .resize(600, 600)
        .write('original-img.jpg');
      })

      Jimp.read(selectedEle.elePath)
      .then(img => {
        return img
        // comments
        .color([{ apply: 'red', params: [0] }])
        // retweets
        .color([{ apply: 'green', params: [0] }])
        // likes
        .color([{ apply: 'blue', params: [0]}])
        .resize(600, 600)
          .write('altered-img.jpg');
      })
      .catch(err => {
        console.error(err);
      })
      .then(() => {
        // return tweetTheModifiedImage(selectedEle);
      })
  })
}

const tweetTheModifiedImage = (selectedEle) => {

  T.post('media/upload', {
        media: imageToTweet,
    }, function(error, media, response) {
        if(error){
          console.log(error);
        }
        if (!error) {
            var status = {
                status: `${selectedEle.userFollowers}, ${selectedEle.userLikes}`,
                media_ids: media.media_id_string
            }
            T.post('statuses/update', status, function(error, tweet, response) {
                if (!error) {
                    console.log("Posted.");
                }
            });
        }
    });
  }

//   sendTheDataToTheDb = (imageToTweet, originalImage, selectedEle) => {
//     mongo.connect(connectionURL,
//       { useNewUrlParser: true },
//       (err, client) => {
//
//       const db = client.db('oroborogram-db');
//       const collection = db.collection('data')
//
//       if (err) {
//         console.error(err)
//         return
//       }
//       collection.insertOne(
//         {originalImage: originalImage,
//         imageToTweet: imageToTweet,
//         selectedEle: {
//           userFollowers: selectedEle.userFollowers,
//           userLikes: selectedEle.userLikes
//         }}
//       , (err, result) => {
//     })
// })}

// app.get('/main-data', (req, res) => {
//   mongo.connect(connectionURL, {
//        useNewUrlParser: true,
//      }, (error, client) => {
//
//      const db = client.db('oroborogram-db');
//      const collection = db.collection('data')
//
//        if(error){
//          return console.log("Unable to connect to the db.");
//        }
//        collection
//          .find()
//          .toArray((error, data) => {
//            console.log(data);
//            res.json(data);
//          });
//      })
// })

runTheBot();

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
