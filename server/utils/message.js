var moment = require("moment");


var generateMessage = (from, text, bufferCss, arrToString) => {
  return{
    from,
    text,
    bufferCss,
    arrToString,
    createdAt: moment().valueOf()
  };
};




module.exports = {generateMessage, generateLocationMessage};
