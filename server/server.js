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
        screen_name: 'afp'
    };
    T.get('statuses/user_timeline', options, function(err, data) {

        let arrayLengthTwitter = data.length;

        var randomArraylengthTwitter = Math.floor(Math.random() * Math.floor(arrayLengthTwitter))
        var twittedLink = data[randomArraylengthTwitter].entities.media[0].media_url_https;


        let ArrayOfThePickedEleUser = _.values(data[randomArraylengthTwitter].user);
        let arrayNumbsTwitter = ArrayOfThePickedEleUser.filter(ele => _.isNumber(ele));

        request('https://www.reddit.com/r/food.json', function(error, response, body) {
            var bodyObj = JSON.parse(body);
            let arrayLength = bodyObj.data.children.length;
            var randomArraylength = Math.floor(Math.random() * Math.floor(arrayLength))
            let ArrayOfThePickedEle = _.values(bodyObj.data.children[randomArraylength].data);
            let randomArrayTitle = bodyObj.data.children[randomArraylength].data.title;
            let arrayNumbs = ArrayOfThePickedEle.filter(ele => _.isNumber(ele) && ele > 0);
            let twittedLink2 = bodyObj.data.children[randomArraylength].data.url;


            Jimp.read(twittedLink2, function(err, twittedLink2) {

                const filters = ["hue", "saturate", "brighten"];
                if (err) throw err;
                twittedLink2
                    .blur(getRandomEleFromArray(arrayNumbs))
                    .resize(600, 600)
                    .color([
                    { apply: getRandomEleFromArray(filters),
                      params: [ getRandomEleFromArray(arrayNumbs)]
                    }
                ]).write("food-small.jpg");

                  T.post('media/upload', {
                      media: imageToSend
                  }, function(error, media, response) {
                      if (!error) {
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


            console.log(twittedLink);

            function getRandomEleFromArray(array) {
                return array[Math.floor(Math.random() * array.length)];
            }


            T.get('statuses/user_timeline', {screen_name	: 'food_analytics'}, function(err, data, response) {
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
