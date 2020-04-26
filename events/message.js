const usedCommandRecently = {};

module.exports = async (client, message) => {
  if (message.author.id === client.config.shawnID) {
    message.react(shawger);
  }

  if (message.author.bot || message.content.charAt(0) != client.config.prefix)
    return;
  let args = message.content.substring(client.config.prefix.length).split(' ');

  if (client.commands.get(args[0])) {
    if (usedCommandRecently[message.author.id]) {
      message.reply(
        `You cannot use that command just yet! Wait another ${
          (client.config.cooldownTime -
            (new Date().getTime() - usedCommandRecently[message.author.id])) /
          1000
        } seconds`
      );
    } else {
      client.commands.get(args[0]).execute(message, args);
      usedCommandRecently[message.author.id] = new Date().getTime();
      setTimeout(() => {
        delete usedCommandRecently[message.author.id];
      }, cooldownTime);
    }
  }
};
