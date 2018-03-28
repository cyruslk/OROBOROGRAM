var socket = io();


socket.on('connect', function() {
    console.log("new content posted");
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('getTheUsersData', function(message) {

    message: message
    console.log(message);

    let bodyObj = message.bodyObj;
    let arrayNumbs = message.arrayNumbs;
    let url = message.randomImg;

    // let randomValue = randomValues[Math.floor(Math.random() * ((randomValues.length - 1) - 0 + 1))];
    // console.log("HERE!" , randomValue);

    let randomFilters = ["contrast", "grayscale", "invert", "opacity", "saturate", "sepia"];
    let randomFilter = randomFilters[Math.floor(Math.random() * ((randomFilters.length - 1) - 0 + 1))];


    var template = jQuery("#message-template").html();

    var html = Mustache.render(template, {
        url: url,
        // randomFilter: randomFilter,
        // randomValue: randomValue
    });

    // $('#message-template').html(html);

    $('#target').html(html);


});
