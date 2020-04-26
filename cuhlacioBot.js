const Discord = require('discord.js');

require('dotenv').config();

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.mongoose = require('./utils/mongoose');
client.config = require('./config.js');
client.loader = require('./modules/Loader');

const init = async () => {
  console.clear();
  const loader = client.loader;
  await loader.registerModules(client);
  await loader.registerCommands(client);
  await loader.registerEvents(client);
  await loader.checkDiscordStatus(client);
  await client.mongoose.init();
  await client.scheduler.start(client);
  await client.login(process.env.TOKEN);
};

init();
