const sendMessage = (text) => {
  return {
    text,
    createdAt: new Date().getTime(),
  };
};

module.exports = { sendMessage };
