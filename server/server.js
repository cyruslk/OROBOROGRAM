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
    Twit = require('twit');


var options = {
  renderDelay: 8000,
};


io.on("connection", (socket) => {
  console.log("New connection from the client!");

    request('https://www.reddit.com/r/foodporn.json', function (error, response, body) {
      var bodyObj = JSON.parse(body);
      // console.log("THIS SHIT", bodyObj);

    socket.emit('getTheUsersData', {
      bodyObj: bodyObj
    });


    let arrayLength = bodyObj.data.children.length;
    console.log("0", arrayLength);
    let randomArraylength = Math.floor(Math.random() * Math.floor(arrayLength))

    var random_img = bodyObj.data.children[randomArraylength].data.url;

    webshot(random_img, 'food.jpg', options, function(err) {

      Jimp.read("food.jpg", function (err, food) {
          if (err) throw err;
          food.quality(100)                 // set JPEG quality
               .write("food-small-bw.jpg"); // save
      });

    });

  });


  socket.on("disconnect", () => {
    console.log("New disconnection from the client!");
  })
})

var data = require('fs').readFileSync('food-small-bw.jpg');

app.use(express.static(publicPath));


server.listen(port, () =>{
  console.log(`Server is up on port ${port}`);
})



  // VJm2CF0caRX62UfO5QQ8h9KWB
