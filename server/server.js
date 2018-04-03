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
var imageToSend = fs.readFileSync('food-small-bw.jpg', {encoding: 'base64'});
var imageToAlter = fs.readFileSync('food.jpg');




io.on("connection", (socket) => {
    // console.log("New connection from the client!");

    request('https://www.reddit.com/r/foodporn.json', function(error, response, body) {
        var bodyObj = JSON.parse(body);

        let arrayLength = bodyObj.data.children.length;
        var randomArraylength = Math.floor(Math.random() * Math.floor(arrayLength))
        let ArrayOfThePickedEle = _.values(bodyObj.data.children[randomArraylength].data);
        let randomArrayTitle = bodyObj.data.children[randomArraylength].data.title;
        let arrayNumbs = ArrayOfThePickedEle.filter(ele => _.isNumber(ele));
        let randomImg = bodyObj.data.children[randomArraylength].data.url;


        var file = fs.createWriteStream("food.jpg");
        var getThisFile = https.get(randomImg, function(response) {
          response.pipe(file);
        });


          Jimp.read(randomImg, function(err, randomImg) {
              if (err) throw err;
              randomImg
                  .color([
                  { apply: 'saturate', params: [ 433 ] },
                  { apply: 'lighten', params: [ 10 ] }
              ]).write("food-small-bw.jpg"); // save
          });


        // T.post('media/upload', {media: imageToSend}, function(error, media, response) {
        //   if (!error) {
        //     // console.log(media);
        //     var status = {
        //       status: `${randomImg} - ${randomArrayTitle} - ${arrayNumbs}`,
        //       media_ids: media.media_id_string // Pass the media id string
        //     }
        //     T.post('statuses/update', status, function(error, tweet, response) {
        //       if (!error) {
        //         // console.log(tweet);
        //       }
        //     });
        //
        //   }
        // });
          // T.get('statuses/user_timeline', {screen_name	: 'food_analytics'}, function(err, data, response) {
          //   var isArr = data.slice(-1)[0];
          //   console.log(isArr);
          // })

    });
    socket.on("disconnect", () => {
        console.log("New disconnection from the client!");
    })
})


app.use(express.static(publicPath));


server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
