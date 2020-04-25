module.exports = {
  name: 'arjun',
  description: 'Sends a spicy picture of arjun being horny af',
  execute(message, args) {
    if (isNaN(Object.keys(args)[0]))
      return message.reply(
        `You need to enter a valid parameter for ${process.env.prefix}arjun <int>`
      );
    let num = Object.keys(args)[0];
    if (num === '1')
      message.channel.send({
        files: ['./images/arjun.png'],
      });
    else if (num === '2')
      message.channel.send({
        files: ['./images/dumbass.png'],
      });
    message.delete();
  },
};
