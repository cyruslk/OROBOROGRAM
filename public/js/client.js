var socket = io();


function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {
    console.log("new content posted");
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('getTheUsersData', function (message) {


  console.log("this is the fucking data", message);

  let title = message.bodyObj.data.children[1].data.title;
  let url = message.bodyObj.data.children[1].data.url;
  let num_comments = message.bodyObj.data.children[1].data.num_comments;
  let score = message.bodyObj.data.children[1].data.score;
  let created = message.bodyObj.data.children[1].data.created;
  let created_utc = message.bodyObj.data.children[1].data.created_utc;
  let downs = message.bodyObj.data.children[1].data.downs;
  let gilded = message.bodyObj.data.children[1].data.gilded;
  let thumbnail_height = message.bodyObj.data.children[1].data.thumbnail_height;
  let thumbnail_width =  message.bodyObj.data.children[1].data.thumbnail_width;


  let randomValues = [num_comments, score, created, created_utc, downs, gilded, gilded, thumbnail_height, thumbnail_width];
  let randomValue = randomValues[Math.floor(Math.random() * ((randomValues.length - 1) - 0 + 1))];
  console.log("HERE!" , randomValue);

  let randomFilters = ["contrast", "grayscale", "invert", "opacity", "saturate", "sepia"];
  let randomFilter = randomFilters[Math.floor(Math.random() * ((randomFilters.length - 1) - 0 + 1))];



  // console.log("THIS IS THE FIRST POST DATA",
  //       `${url} +`,
  //       `${num_comments} +`,
  //       `${score} +`,
  //       `${created}`
  //     );

  var template = jQuery("#message-template").html();

  var html = Mustache.render(template, {
    url: url,
    title: title,
    randomFilter: randomFilter,
    randomValue: randomValue
  });

  // $('#message-template').html(html);

  $('#target').html(html);




  scrollToBottom();


});