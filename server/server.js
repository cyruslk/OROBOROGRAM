const express = require("express");
const path = require("path");
const socketIO = require("socket.io")
const http = require("http");
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



var options = {
    renderDelay: 8000,
};


io.on("connection", (socket) => {
    console.log("New connection from the client!");

    request('https://www.reddit.com/r/foodporn.json', function(error, response, body) {
        var bodyObj = JSON.parse(body);

        let arrayLength = bodyObj.data.children.length;
        var randomArraylength = Math.floor(Math.random() * Math.floor(arrayLength))
        console.log(randomArraylength);

        let ArrayOfThePickedEle = _.values(bodyObj.data.children[randomArraylength].data);

        let randomArrayTitle = bodyObj.data.children[randomArraylength].data.title;

        let arrayNumbs = ArrayOfThePickedEle.filter(ele => _.isNumber(ele));
        console.log(arrayNumbs);
        let randomImg = bodyObj.data.children[randomArraylength].data.url;
        console.log(randomImg);

        T.post('statuses/update', { status: `${randomImg} - ${randomArrayTitle} - ${arrayNumbs}` }, function(err, data, response) {
          // console.log(data)

          socket.emit("browseTwitterArray", () => {
              console.log("New disconnection from the client!");
          })

        })

        webshot(randomImg, 'food.jpg', options, function(err) {
          console.log("what is this", randomImg);
            Jimp.read("food.jpg", function(err, food) {
                if (err) throw err;
                food.color([
                    { apply: 'hue', params: [ 10 ] },
                    { apply: 'lighten', params: [ 1 ] },
                    { apply: 'xor', params: [ '#06D' ] }
                ]).write("food-small-bw.jpg"); // save


            });

        });

    });


    socket.on("disconnect", () => {
        console.log("New disconnection from the client!");
    })
})

var data = require('fs').readFileSync('food-small-bw.jpg');

app.use(express.static(publicPath));


server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
