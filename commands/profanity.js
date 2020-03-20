module.exports = {
  name: 'profanity',
  description:
    "Is used to add or remove profane words. Type 'add' after !profanity to add the following words in the command, and type 'remove' after !profanity to remove the following words in the command.",
  execute(message, args, client, filter) {
    if (
      message.member.roles.cache.some(r => r.name === 'admin') ||
      message.member.roles.cache.some(r => r.name === 'mod') ||
      message.member.roles.cache.some(r => r.name === 'owner') ||
      message.member.hasPermission('ADMINISTRATOR')
    ) {
      switch (args[1]) {
        case 'add':
          for (let arg of args.slice(2, args.length)) filter.add(arg);
          message.reply('Successfully added profane word.');
          break;
        case 'remove':
          for (let arg of args.slice(2, args.length)) filter.remove(arg);
          message.reply('Successfully remove profane word.');
          break;
      }
    } else {
      message.reply(
        'Only admins and mods have the ability to add or remove profane words.'
      );
    }
  }
};
