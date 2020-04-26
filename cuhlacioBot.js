const Discord = require('discord.js');
const cron = require('cron');

require('dotenv').config();

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.mongoose = require('./utils/mongoose');
client.config = require('./config.js');
client.loader = require('./modules/Loader');

// Consider moving cron.job to a module file or functions.js file. The bot.js / index.js should be a small as possible.
cron
  .job(
    client.config.clearSchedule,
    () => {
      console.log('executing');
      let server = client.guilds.cache.get(client.config.guildID);
      let channels = server.channels.cache;
      channels.forEach((channel, key, map) => {
        if (channel instanceof Discord.TextChannel) {
          if (
            channel.name === 'join-log' ||
            channel.name === 'announcements' ||
            channel.name === 'computer-science' ||
            channel.name === 'memes'
          )
            return;
          client.commands.get('clear').clear(channel);
          console.log(`Cleared channel '${channel.name}'`);
        }
      });
    },
    undefined,
    true,
    'America/Chicago'
  )
  .start();

const init = async () => {
  console.clear();
  const loader = client.loader;
  await loader.registerModules(client);
  await loader.registerCommands(client);
  await loader.registerEvents(client);
  await loader.checkDiscordStatus(client);
  await client.mongoose.init();
  await client.login(process.env.TOKEN);
};

init();
