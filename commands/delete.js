module.exports = {
  name: 'delete',
  description: 'Deletes a message sent by the bot with a specific id',
  execute(message, args) {
    switch (args[1].split('=')[0]) {
      case 'id':
        message.channel.messages.fetch(args[1].split('=')[1]).then(message => {
          message.delete();
        });
        break;
    }
  }
};
