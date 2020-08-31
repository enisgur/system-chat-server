let chatHistory = [];
const chatLimit = 100;

const addHistory = (msg) => {
  if (chatHistory.length >= chatLimit) {
    chatHistory.shift();
    chatHistory.push(msg);
    return chatHistory;
  } else {
    chatHistory.push(msg);
    return chatHistory;
  }
};

module.exports = {
  chatHistory,
  addHistory,
};
