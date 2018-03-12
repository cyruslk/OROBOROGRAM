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

  let firstItemImage = message.bodyObj.data.children[1].data.url;
  let firstItemCommentsNumber = message.bodyObj.data.children[1].data.num_comments;
  let firstItemCommentsScore = message.bodyObj.data.children[1].data.score;
  let firstItemCommentsCreated = message.bodyObj.data.children[1].data.created;

  let theRandomStylings = [firstItemCommentsNumber, firstItemCommentsScore, firstItemCommentsCreated];
  let theChosenStyling = theRandomStylings[Math.floor(Math.random() * ((theRandomStylings.length - 1) - 0 + 1))];
  console.log("HERE!" , theChosenStyling);

  console.log("THIS IS THE FIRST POST DATA",
        `${firstItemImage} +`,
        `${firstItemCommentsNumber} +`,
        `${firstItemCommentsScore} +`,
        `${firstItemCommentsCreated}`
      );

  var template = jQuery("#message-template").html();

  var html = Mustache.render(template, {
    firstItemImage: firstItemImage,
    theChosenStyling: theChosenStyling
  });

  // $('#message-template').html(html);

  $('#target').html(html);




  scrollToBottom();


});
