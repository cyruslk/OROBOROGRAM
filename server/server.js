const express = require("express");
const path = require("path");
const socketIO = require("socket.io")
const http = require("http");
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
var _ = require('lodash');
var request = require("request");
var conv = require('binstring');




var app = express();
var server = http.createServer(app);

var io = socketIO(server);


io.on("connection", (socket) => {
  console.log("New connection from the client!");

    request('https://www.reddit.com/r/foodporn.json', function (error, response, body) {
      var bodyObj = JSON.parse(body);
      // console.log("THIS SHIT", bodyObj);

    socket.emit('getTheUsersData', {
      bodyObj: bodyObj
    });

  });


  socket.on("disconnect", () => {
    console.log("New disconnection from the client!");
  })
})


app.use(express.static(publicPath));


server.listen(port, () =>{
  console.log(`Server is up on port ${port}`);
})
