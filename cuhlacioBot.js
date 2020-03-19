const discord = require('discord.js');
const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request');
const token = process.env.token;
const prefix = process.env.prefix;

var client = new discord.Client();
client.msgs = require('./msgs.json');

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
  if (message.author.bot) return;
  let words = message.content.split(' ');
  for (let i = 0; i < words.length; i++) {
    if (words[i] === 'nigga' || words[i] === 'nigger' || words[i] === 'chink') {
      message.reply('Watch your mouth, no slurs allowed');
      return;
    }
  }
  if (message.content.startsWith(prefix + 'hello')) {
    message.reply('Hi!');
  } else if (message.content.startsWith(prefix + 'help')) {
    message.channel.send(`
    Commands:
    !hello -> responds with hi! to check if the bot is working.
    !emojify -> turns a string of letters into emojis
    !elongate -> adds a space between each letter of a message, the number of spaces between letters can be changed using the 'spaces=' flag
    !cuh -> sends the cuhlacios bot profile picture
    !nice cock bro -> sends the 'nice cock bro' image
    !cursed -> sends a random cursed image
    !shut -> sends the 'shut' image
    !hw add -> adds an assignment to the list of current assignments. requires the 'teacher=', 'due=', 'name=', and 'grade=' flags, where 'due=' represents the date when the assignment is due. Optional flags include 'completion' and 'assigned=' (which represents the date when the assignment was assigned).
    !hw get -> sends a series of embeds for each assignment in the list of current assignments. Optional flags include 'teacher=' which only retrieves assignments from a particular teacher, 'due=', which only retrieves assignments due on a particular date, and 'name=', which only retrieves assignments with a particular name.
    !hw remove -> removes a particular assignment from the list of current assignments. Requires the 'name=' which specifies the name of the assignment to remove.
    `);
  } else if (message.content.startsWith(prefix + 'emojify')) {
    let text = message.content
      .substring(9)
      .toLowerCase()
      .replace(/\W|[0-9]|_/g, '');
    let reply = '';
    for (let i in text)
      reply += ' :regional_indicator_' + text.charAt(i) + ': ';

    message.channel.send(reply);
  } else if (message.content.startsWith(prefix + 'elongate')) {
    let spaces = 1;
    let text = message.content.substring(10);
    if (message.content.startsWith(prefix + 'elongate spaces=')) {
      spaces = parseInt(message.content.split(' ')[1].substring(7));
      console.log('spaces: ' + spaces);
      text = message.content.substring(18 + spaces.toString.length);
    }
    let reply = '';
    for (let i in text) {
      reply += text.charAt(i);
      for (let j = 0; j < spaces; j++) reply += ' ';
    }

    message.channel.send(reply);
  } else if (message.content.startsWith(prefix + 'cuh')) {
    message.channel.send({
      files: ['./images/on_my_momma_cuh.jpg']
    });
  } else if (message.content.startsWith(prefix + 'nice cock bro')) {
    message.channel.send({
      files: ['./images/nice_cock_bro.jpg']
    });
  } else if (message.content.startsWith(prefix + 'cursed')) {
    message.channel.send({
      files: [
        './images/cursed/cursed_' +
          (Math.floor(Math.random() * 19) + 1) +
          '.jpg'
      ]
    });
  } else if (message.content.startsWith(prefix + 'random')) {
    let searchTerm = message.content.substring(8);
    image(searchTerm, message);
  } else if (message.content.startsWith(prefix + 'shut')) {
    message.channel.send({ files: ['./images/shut.png'] });
  } else if (message.content.startsWith(prefix + 'hw')) {
    let assignment = new Assignment();
    let words = message.content.split(' ');
    if (message.content.substring(4).startsWith('add')) {
      for (let i = 0; i < words.length; i++) {
        if (words[i].startsWith('teacher='))
          assignment.teacher = words[i].substring(8);
        else if (words[i].startsWith('assigned=')) {
          assignment.assigned = words[i].substring(9);
        } else if (words[i].startsWith('due=')) {
          assignment.due = words[i].substring(4);
        } else if (words[i].startsWith('name=')) {
          assignment.name = words[i].substring(5);
        } else if (words[i].startsWith('completion')) {
          assignment.completion = true;
        } else if (words[i].startsWith('grade=')) {
          switch (words[i].substring(6)) {
            case 'project':
              assignment.gradeType = gradeTypes.PROJECT;
              break;
            case 'test':
              assignment.gradeType = gradeTypes.TEST;
              break;
            case 'cwhw':
              assignment.gradeType = gradeTypes.CLASSWORK_HOMEWORK;
              break;
            case 'six-weeks-test':
              assignment.gradeType = gradeTypes.SIX_WEEKS_TEST;
              break;
          }
        }
      }
      if (assignment.teacher == null) {
        message.reply(
          'You need to specify the teacher which assigned this assignment.'
        );
        return;
      }
      if (assignment.due == null) {
        message.reply(
          'You need to specify the date when this assignment is due'
        );
        return;
      }
      if (assignment.name == null) {
        message.reply('You need to specify the name of this assignment');
        return;
      }
      if (assignment.gradeType == null) {
        message.reply(
          'You need to specify what type of grade this assignment is: "project", "test", "cwhw" (for classwork / homework), or "six-weeks-test"'
        );
        return;
      }
      let assignments = client.msgs['assignments'];
      assignments.push(assignment);
      fs.writeFile('./msgs.json', JSON.stringify(client.msgs, null, 4), err => {
        if (err) throw err;
        message.reply(
          'Your assignment has been successfully added. Type "!hw get" to view current assignments.'
        );
      });
    } else if (message.content.substring(4).startsWith('get')) {
      let assignments = client.msgs['assignments'].slice();

      if (assignments.length === 0) message.reply('There are no assignments.');

      let words = message.content.substring(8).split(' ');
      let teacher = '';
      let due = '';
      let name = '';
      console.log(words);
      for (let i = 0; i < words.length; i++) {
        if (words[i].startsWith('teacher=')) teacher = words[i].substring(8);
        else if (words[i].startsWith('due=')) due = words[i].substring(4);
        else if (words[i].startsWith('name=')) name = words[i].substring(5);
      }

      console.log('teacher: ' + teacher + ', due: ' + due + ', name: ' + name);

      for (let i = 0; i < assignments.length; i++) {
        let assignment = assignments[i];

        if (teacher !== '' && assignment.teacher !== teacher) continue;
        if (due !== '' && assignment.due !== due) continue;
        if (name !== '' && assignment.name !== name) continue;

        embed = new discord.MessageEmbed()
          .setColor('#03cffc')
          .setTitle(assignment.name)
          .addFields(
            { name: 'Teacher', value: assignment.teacher },
            {
              name: 'Date Due',
              value: assignment.due.toString().substring(0, 14)
            },
            { name: 'Grade Type', value: assignment.gradeType }
          );

        if (assignment.assigned != null) {
          embed.addField(
            'Date Assigned',
            assignment.assigned.toString().substring(0, 14)
          );
        }
        if (assignment.completion) embed.addField('Completion', 'yes');
        message.channel.send(embed);
      }
    } else if (message.content.substring(4).startsWith('remove')) {
      let words = message.content.substring(11).split(' ');
      console.log(words);
      let name = '';
      for (let i = 0; i < words.length; i++) {
        if (words[i].startsWith('name=')) {
          name = words[i].substring(5);
          console.log(name);
          break;
        }
      }
      let assignments = client.msgs['assignments'];
      for (let i = 0; i < assignments.length; i++) {
        if (assignments[i].name === name) assignments.pop(assignments[i]);
      }
      fs.writeFile('./msgs.json', JSON.stringify(client.msgs, null, 4), err => {
        if (err) throw err;
        message.reply('Successfully deleted assignment "' + name + '"');
      });
    } else if (message.content.substring(4).startsWith('edit')) {
    }
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
