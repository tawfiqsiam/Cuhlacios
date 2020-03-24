const fs = require('fs');
const discord = require('discord.js');

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
    this.answers = [];
  }
}

module.exports = {
  name: 'hw',
  description: `add -> adds an assignment to the list of current assignments. requires the 'teacher=', 'due=', 'name=', and 'grade=' flags, where 'due=' represents the date when the assignment is due. Optional flags include 'completion' and 'assigned=' (which represents the date when the assignment was assigned). Any files attached to the command message will be added as answers to the assignment.
  get -> sends a series of embeds for each assignment in the list of current assignments. Optional flags include 'teacher=' which only retrieves assignments from a particular teacher, 'due=', which only retrieves assignments due on a particular date, and 'name=', which only retrieves assignments with a particular name.
  remove -> removes a particular assignment from the list of current assignments. Requires either the 'index=' flag, 'teacher=' flag, 'name=' flag, or 'due=' flag, which delete an assignment with a specific index (starting from 1), teacher, name, or due date respectively. Additional flags include '*', which deletes all assignments.
  edit -> edits a particular assignment from the list of current assignments with a given index, specified by the 'index=' flag, which is required. Then, the same flags given to the 'add' command can be used to edit the assignment, and 'append' and 'replace' can be used to append files to an assignment and replace all files of an assignment with new ones, respectively. Also, the 'remove=' flag can be used to remove an attachment with a specific index (starting from 1). `,
  execute(message, args, client) {
    let assignments = client.msgs['assignments'];
    switch (args[1]) {
      case 'add':
        let assignment = getAssignment(args, 2);

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

        message.attachments
          .array()
          .forEach(attachment => assignment.answers.push(attachment.url));

        assignments.push(assignment);
        writeFile(
          client,
          message,
          `Your assignment '${assignment.name}' has been successfully added. Type "!hw get" to view current assignments.`
        );
        break;
      case 'get':
        if (assignments.length === 0)
          message.reply('There are no assignments.');

        let teacher = '';
        let due = '';
        let name = '';

        for (let arg of args.slice(2, args.length)) {
          switch (arg.split('=')[0]) {
            case 'teacher':
              teacher = arg.split('=')[1];
              break;
            case 'due':
              due = arg.split('=')[1];
              break;
            case 'name':
              name = arg.split('=')[1];
              break;
          }
        }

        for (let assignment of assignments) {
          if (teacher !== '' && assignment.teacher !== teacher) continue;
          if (due !== '' && assignment.due.split('@')[0] !== due) continue;
          if (name !== '' && assignment.name !== name) continue;

          embed = new discord.MessageEmbed()
            .setColor('#03cffc')
            .setTitle(assignment.name)
            .addFields(
              { name: 'Teacher', value: assignment.teacher },
              {
                name: 'Due Date',
                value: assignment.due.toString()
              }
            );

          if (assignment.answers != null) {
            embed.attachFiles(assignment.answers);
          }

          if (assignment.gradeType != null) {
            embed.addField('Grade Type', assignment.gradeType);
          }

          if (assignment.assigned != null) {
            embed.addField('Date Assigned', assignment.assigned.toString());
          }
          if (assignment.completion == null || assignment.completion == 'false')
            embed.addField('Completion', 'No');
          else embed.addField('Completion', 'Yes');
          message.channel.send(embed);
        }
        break;
      case 'remove':
        if (assignments.length === 0)
          message.reply('There are no assignments to remove.');

        let all = false;
        let index = '';
        let teacher1 = '';
        let due1 = '';
        let name1 = '';

        for (let arg of args.slice(2, args.length)) {
          if (arg === '*') {
            all = true;
            break;
          }
          switch (arg.split('=')[0]) {
            case 'index':
              index = parseInt(arg.split('=')[1]);
              break;
            case 'teacher':
              teacher1 = arg.split('=')[1];
              break;
            case 'due':
              due1 = arg.split('=')[1];
              break;
            case 'name':
              name1 = arg.split('=')[1];
              break;
          }
        }

        if (all) {
          assignments.splice(0, assignments.length);
          message.reply('Successfully deleted all assignments');
        } else
          for (let i = 0; i < assignments.length; i++) {
            if (
              i === index - 1 ||
              assignments[i].teacher === teacher1 ||
              assignments[i].due === due1 ||
              assignments[i].name === name1
            ) {
              message.reply(
                'Successfully deleted assignment "' + assignments[i].name + '"'
              );
              assignments.pop(i);
            }
          }

        writeFile(client, message, '');

        break;
      case 'edit':
        let index1 = parseInt(args[2].split('=')[1]) - 1;
        let assignment1 = getAssignment(args, 3);

        for (let arg of args) {
          if (arg.split('=')[0] === 'remove') {
            assignments[index1].answers.splice(parseInt(arg.split('=')[1]) - 1);
          }
        }

        if (args.includes('append')) {
          if (assignments[index1].answers == null)
            assignments[index1].answers = [];
          message.attachments.forEach(attachment =>
            assignments[index1].answers.push(attachment.url)
          );
        } else if (args.includes('replace')) {
          assignments[index1].answers = [];
          message.attachments.forEach(attachment =>
            assignments[index1].answers.push(attachment.url)
          );
        }

        if (assignment1.assigned != null)
          assignments[index1].assigned = assignment1.assigned;
        if (assignment1.completion != null)
          assignments[index1].completion = assignment1.completion;
        if (assignment1.due != null) assignments[index1].due = assignment1.due;
        if (assignment1.gradeType != null)
          assignments[index1].gradeType = assignment1.gradeType;
        if (assignment1.name != null)
          assignments[index1].name = assignment1.name;
        if (assignment1.teacher != null)
          assignments[index1].teacher = assignment1.teacher;

        writeFile(
          client,
          message,
          `Your assignment '${assignments[index1].name}' was successfully edited`
        );
    }
  }
};

function writeFile(client, message, succeedMessage) {
  fs.writeFile('./msgs.json', JSON.stringify(client.msgs, null, 4), err => {
    if (err) throw err;
    if (succeedMessage !== '') message.reply(succeedMessage);
  });
}

function getAssignment(args, startIndex) {
  let assignment = new Assignment();
  for (let arg of args.slice(startIndex, args.length)) {
    switch (arg.split('=')[0]) {
      case 'teacher':
        assignment.teacher = arg.split('=')[1];
        break;
      case 'assigned':
        assignment.assigned = arg.split('=')[1];
        break;
      case 'due':
        assignment.due = arg.split('=')[1];
        break;
      case 'name':
        assignment.name = arg.split('=')[1];
        break;
      case 'completion':
        assignment.completion = arg.split('=')[1];
        break;
      case 'grade':
        switch (arg.split('=')[1]) {
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
        break;
    }
  }
  return assignment;
}
