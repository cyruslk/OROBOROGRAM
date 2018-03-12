var expect = require("expect");
var {generateMessage, generateLocationMessage} = require("./message");


describe("generateMessage", () => {
    it("should generate correct message object", () => {
      var from = "cyrus";
      var text = "some shit";
      var message = generateMessage(from, text);

      expect(message.createdAt).toBeA("number");
      expect(message).toInclude({from,text});

    })
})



describe("generateLocationMessage", () => {
    it("should generate correct location object", () => {
      var from = "cyrus";
      var latitude = 15;
      var longitude = 15;
      var url = "https://www.google.com/maps?q=15,15";

      var message = generateLocationMessage(from, latitude, longitude);

      expect(message.createdAt).toBeA("number");
      expect(message).toInclude({from,url});

    })
})

module.exports = {generateMessage, generateLocationMessage};
