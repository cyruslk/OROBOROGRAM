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
    // var imageToAlter = fs.readFileSync('food.jpg');

io.on("connection", (socket) => {

    var imageToSend = fs.readFileSync('food-small.jpg', {
        encoding: 'base64'
    });

    var options = {
        screen_name: 'ltsYourFoodPorn'
    };
    T.get('statuses/user_timeline', options, function(err, data) {

        let arrayLengthTwitter = data.length;
        var randomArraylengthTwitter = Math.floor(Math.random() * Math.floor(arrayLengthTwitter))
        var twittedLink = data[randomArraylengthTwitter].entities.media[0].media_url_https;
        console.log(twittedLink);
        let ArrayOfThePickedEleUser = _.values(data[randomArraylengthTwitter].user);
        //
        let arrayNumbsTwitter = ArrayOfThePickedEleUser.filter(ele => _.isNumber(ele));
        //
        // function getRandomValueTwitNumbers() {
        //     return arrayNumbsTwitter[Math.floor(Math.random() * arrayNumbsTwitter.length)];
        // }

        request('https://www.reddit.com/r/foodporn.json', function(error, response, body) {
            var bodyObj = JSON.parse(body);

            let arrayLength = bodyObj.data.children.length;
            var randomArraylength = Math.floor(Math.random() * Math.floor(arrayLength))
            let ArrayOfThePickedEle = _.values(bodyObj.data.children[randomArraylength].data);
            let randomArrayTitle = bodyObj.data.children[randomArraylength].data.title;
            let arrayNumbs = ArrayOfThePickedEle.filter(ele => _.isNumber(ele));
            let randomImg = bodyObj.data.children[randomArraylength].data.url;

            console.log(arrayNumbs);


            function getRandomValue() {
                return arrayNumbs[Math.floor(Math.random() * arrayNumbs.length)];
            }

            // console.log(arrayNumbsTwitter);

            Jimp.read(twittedLink, function(err, twittedLink) {
                if (err) throw err;
                twittedLink
                    .blur(getRandomValue())
                    .resize(600, 600)
                    .color([
                    { apply: 'hue', params: [ getRandomValue()]}
                ]).write("food-small.jpg"); // save
                console.log("The image is modified!");

                  T.post('media/upload', {
                      media: imageToSend
                  }, function(error, media, response) {
                      if (!error) {
                          // console.log(media);
                          var status = {
                              status: `${arrayNumbsTwitter}`,
                              media_ids: media.media_id_string // Pass the media id string
                          }
                          T.post('statuses/update', status, function(error, tweet, response) {
                              if (!error) {
                                  console.log("The modified image is sent to Twitter");
                              }
                          });
                      }
                  });

            });


            T.get('statuses/user_timeline', {screen_name	: 'food_analytics'}, function(err, data, response) {
              var isArr = data.slice(-1)[0];
              // console.log(isArr);
            })


        });

    })

    socket.on("disconnect", () => {
        console.log("New disconnection from the client!");
    })

})


app.use(express.static(publicPath));


server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
