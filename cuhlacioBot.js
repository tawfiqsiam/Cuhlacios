const discord = require('discord.js');

const client = new discord.Client();
client.msgs = require('./msgs.json');

const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request');

client.commands = new discord.Collection();

const commandFiles = fs
  .readdirSync('./commands/')
  .filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const token = process.env.token;
const prefix = process.env.prefix;

function image(searchTerm, message) {
  var options = {
    url: 'http://results.dogpile.com/serp?qc=images&q=' + searchTerm,
    method: 'GET',
    headers: {
      Accept: 'text/html',
      'User-Agent': 'Chrome'
    }
  };

  request(options, (error, response, responseBody) => {
    if (error) return;
    $ = cheerio.load(responseBody);
    var links = $('.image a.link');
    var urls = new Array(links.length)
      .fill(0)
      .map((v, i) => links.eq(i).attr('href'));
    console.log(urls);
    if (!urls.length) return;

    message.channel.send(urls[Math.floor(Math.random() * urls.length)]);
  });
}

client.on('ready', () => {
  console.log('ready');
  client.user.setActivity("nothing. I'm a bot. I can't play anything");
});

client.on('message', message => {
  if (message.author.id === '495824437506080769') {
    message.react(':shawger:');
  }

  if (message.author.bot || message.content.charAt(0) != '!') return;
  let args = message.content.substring(prefix.length).split(' ');

  switch (args[0]) {
    case 'hello':
      client.commands.get('hello').execute(message, args);
      break;
    case 'help':
      client.commands.get('help').execute(message, args);
      break;
    case 'poll':
      client.commands.get('poll').execute(message, args);
      break;
    case 'emojify':
      client.commands.get('emojify').execute(message, args);
      break;
    case 'elongate':
      client.commands.get('elongate').execute(message, args);
      break;
    case 'cuh':
      client.commands.get('cuh').execute(message, args);
      break;
    case 'niceCockBro':
      client.commands.get('niceCockBro').execute(message, args);
      break;
    case 'cursed':
      client.commands.get('cursed').execute(message, args);
      break;
    case 'shut':
      client.commands.get('shut').execute(message, args);
      break;
    case 'random':
      client.commands.get('random').execute(message, args);
      break;
    case 'hw':
      client.commands.get('hw').execute(message, args, client);
      break;
    case 'react':
      client.commands.get('react').execute(message, args);
      break;
    case 'dub':
      client.commands.get('dub').execute(message, args);
      break;
    case 'delete':
      client.commands.get('delete').execute(message, args);
      break;
    case 'arjun':
      client.commands.get('arjun').execute(message, args);
  }
});

client.login(token);

const gradeTypes = {
  PROJECT: 'Project',
  TEST: 'Test',
  CLASSWORK_HOMEWORK: 'Classwork / Homework',
  SIX_WEEKS_TEST: 'Six-Weeks Test'
};

class Assignment {
  constructor(teacher, assigned, due, completion, gradeType, name) {
    this.teacher = teacher;
    this.assigned = assigned;
    this.due = due;
    this.completion = completion;
    this.gradeType = gradeType;
    this.name = name;
  }
}
