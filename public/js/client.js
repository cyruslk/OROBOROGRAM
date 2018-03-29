var socket = io();


socket.on('connect', function() {
    console.log("new content posted");
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('sendLastItem', function(message) {

  console.log("this is the message");


    // var template = jQuery("#message-template").html();
    // var html = Mustache.render(template, {
    //     url: url,
    // });
    // $('#target').html(html);


});
