const sendMessage = (userName, text) => {
  return {
    userName,
    text,
    createdAt: new Date().getTime(),
  };
};

const sendLocation = (userName, url) => {
  return {
    userName,
    url,
    createdAt: new Date().getTime(),
  };
};

module.exports = { sendMessage, sendLocation };
