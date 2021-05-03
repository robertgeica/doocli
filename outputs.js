const chalk = require("chalk");
const utils = require("./utils");

const boardColor = "0077B5";
const taskNameColor = '0077B5';
const taskIdColor = "fff";
const taskCompletedColor = '2980b9';
const taskIsNotCompletedColor = 'e74c3c';
const taskDueDateColor = 'ff5700';

const emptyList = () => {
  console.log(
    chalk.hex("e67e22")(
      "Your list is empty.",
      chalk.hex("fff")(`Stuck? Try 'doo --help'`)
    )
  );
};
const listTasks = (data) => {
  data.forEach((board) => {
    const boardName = chalk.hex(boardColor).bold(`@${board.boardName}`);
    const tasksStatus = chalk.hex(boardColor)(`[x]/[x]`);

    console.log(`\v${boardName} ${tasksStatus}`);
    board.tasks.forEach((task) => {
      const taskId = chalk.hex(taskIdColor).bold(`${task.id}`);
      const taskIsComplete = task.taskComplete ? chalk.hex(taskCompletedColor)(`[x]`) : chalk.hex(taskIsNotCompletedColor)(`[ ]`);;
      const taskName = chalk.hex(taskNameColor).bold(`${task.taskName}`);
      const taskDueDate = chalk.hex(taskDueDateColor)(`${utils.formatDueDate(task.dueDate)}`);
      
      const taskPriority = task.taskPriority;

      console.log(
        `${taskId}\  ${taskIsComplete}\t ${taskName}\t${taskDueDate}\   \t${taskPriority}`
      );
    });
  });
};

module.exports = {
  emptyList,
  listTasks,
};
