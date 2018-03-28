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

        let arrayNumbs = ArrayOfThePickedEle.filter(ele => _.isNumber(ele));
        console.log(arrayNumbs);
        let randomImg = bodyObj.data.children[randomArraylength].data.url;
        console.log(randomImg);

        T.post('statuses/update', { status: `${randomImg}` }, function(err, data, response) {
          console.log(data)
        })

        socket.emit('getTheUsersData', {
            bodyObj: bodyObj,
            arrayNumbs: arrayNumbs,
            randomImg: randomImg
        });

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


// function upload_random_image(images){
//   console.log('Opening an image...');
//   var image_path = path.join(__dirname, '/images/' + random_from_array(images)),
//       b64content = fs.readFileSync(image_path, { encoding: 'base64' });
//
//   console.log('Uploading an image...');
//
//   T.post('media/upload', { media_data: b64content }, function (err, data, response) {
//     if (err){
//       console.log('ERROR:');
//       console.log(err);
//     }
//     else{
//       console.log('Image uploaded!');
//       console.log('Now tweeting it...');
//
//       T.post('statuses/update', {
//         media_ids: new Array(data.media_id_string)
//       },
//         function(err, data, response) {
//           if (err){
//             console.log('ERROR:');
//             console.log(err);
//           }
//           else{
//             console.log('Posted an image!');
//           }
//         }
//       );
//     }
//   });
// }
