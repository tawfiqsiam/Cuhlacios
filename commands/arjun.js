module.exports = {
  name: 'arjun',
  description: 'Sends a spicy picture of arjun being horny af',
  execute(message, args) {
    message.channel.send({
      files: ['./images/arjun.png']
    });
    message.delete();
  }
};
