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

const runTheBot = () => {
  const arrayOfImages = [];
  T.get('search/tweets', { q: 'images', count: 100 }, function(err, data, response) {
      return data.statuses.map((ele, index) => {
        if(ele.entities.media){

          const arrayOfImages = [];
          const elePath = ele.entities.media[0].media_url_https;

          arrayOfImages.push({
            imgSource: elePath,
            userFollowers: ele.user.followers_count,
            userLikes: ele.user.friends_count
          })
        }else{
          return;
        }
      })
  })
}

const alterTheImage = (array) => {
  console.log(array[0], "------here");
}

runTheBot();


server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
