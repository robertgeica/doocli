#!/usr/bin/env node

const yargs = require('yargs');
const todos = require('./todos.js');

// customize yargs version
yargs.version('1.1.0');

// list command
yargs.command({
  command: 'list',
  describe: 'list all todos',

  handler() {
    todos.listTodos()
  }
});

// create add command
// app add [todo name], optional: [duedate]
yargs.command({
    command: 'add',
    describe: 'add todo',

    handler(argv) {
        todos.addTodo(argv._[1], argv._[2])
    }
});

// create remove command
// app remove [id]
yargs.command({
  command: 'remove',
  describe: 'remove todo',

  handler(argv) {
    console.log(argv._[1]);
    todos.removeTodo(argv._[1]);
  }
});

// mark todo as completed
// app c [id]
yargs.command({
  command: 'c',
  describe: 'mark as (un)complete',
  
  handler(argv) {
    todos.markCompleted(argv._[1]);
  }
});

// add due date
// doo dd [id] [tom/tod/number]
yargs.command({
  command: 'dd',
  describe: 'add/modify due date',

  handler(argv) {
    todos.dueDate(argv._[1], argv._[2]);
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
yargs.command({
  command: 'stats',
  describe: 'stats for task',

  handler(argv) {
    todos.getStats(argv._[1]);
  }
});

// stop time
yargs.parse();