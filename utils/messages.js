const moment = require("moment");

let messages = [];

const formatMessage = async (username, text, room) => {
  // console.log("CHECKKKKKKKKKKKKKK : ", room);

  /* let msg = {
    username,
    text,
    time: moment().format("h:mm a"),
  };

  if (messages.length < 1) {
    let createMessage = {
      room,
      messages: [
        {
          username,
          text,
          time: moment().format("h:mm a"),
        },
      ],
    };

    messages.push(createMessage);
    console.log(messages);
    return messages;
  } else {
    //check if room is exist
    // let newMessages = messages.filter((r) => {
    //   return r.room === room;
    // });

    const findTheIndex = (element) => element.room === room;

    // add new message to existing room
    if (messages.findIndex(findTheIndex) >= 0) {
      const myIndex = messages.findIndex(findTheIndex);
      console.log("indexxx : ", myIndex);
      // console.log("Checkkkkk : ", messages.findIndex(myIndex));

      messages[myIndex].messages.push(msg);

      console.log(messages);

      return messages;

      // newMessages[0].messages.push(msg);
      // return newMessages;
    } else {
      console.log("SERVER error : utils/messages.js");
      console.log(messages);
      return null;
    }
  }
  */

  return {
    username,
    text,
    time: moment().format("h:mm a"),
    room,
  };
};

module.exports = formatMessage;
