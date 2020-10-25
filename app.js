#!/usr/bin/env node

const yargs = require('yargs');
const todos = require('./todos.js');

// customize yargs version
yargs.version('1.1.0');

// list command
// doo list
yargs.command({
  command: 'list',
  describe: 'list all todos',

  handler() {
    todos.listTasks()
  }
});

// create add command
// doo add <todo> <board> <dueDate>
// doo add <todo> <board>
// doo add <todo>
yargs.command({
    command: 'add',
    describe: 'add todo',

    handler(argv) {
        todos.addTask(argv._[1], argv._[2], argv._[3])
    }
});

// create remove command
// doo r <id>
yargs.command({
  command: 'r',
  describe: 'remove task',

  handler(argv) {
    todos.removeTask(argv._[1]);
  }
});

// mark todo as completed
// doo c <id>
yargs.command({
  command: 'c',
  describe: 'mark as (un)complete',
  
  handler(argv) {
    todos.setCompleted(argv._[1]);
  }
});

// add due date
// doo dd <id> <tod/tom/int>
yargs.command({
  command: 'dd',
  describe: 'add/modify due date',

  handler(argv) {
    todos.setDueDate(argv._[1], argv._[2]);
  }
});

// start timer
// doo start <id>
yargs.command({
  command: 'start',
  describe: 'start time tracking for task',

  handler(argv) {
    todos.startTimer(argv._[1]);
  }
});

// stop timer
// doo stop <id>
yargs.command({
  command: 'stop',
  describe: 'stop time tracking for task',

  handler(argv) {
    todos.stopTimer(argv._[1]);
  }
});

// stats
// doo stats <id>
// yargs.command({
//   command: 'stats',
//   describe: 'stats for task',

//   handler(argv) {
//     todos.getStats(argv._[1]);
//   }
// });

// doo touch <boardName>
yargs.command({
  command: 'touch',
  describe: 'create new board',

  handler(argv) {
    todos.addBoard(argv._[1]);
  }
});

// doo rm <boardName>
yargs.command({
  command: 'rm',
  describe: 'remove a board',

  handler(argv) {
    todos.removeBoard(argv._[1]);
  }
});

// doo mv <id> <toBoard>
yargs.command({
  command: 'mv',
  describe: 'move task in another board',

  handler(argv) {
    todos.moveTask(argv._[1], argv._[2]);
  }
});

// stop time
yargs.parse();
