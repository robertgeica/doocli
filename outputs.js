const chalk = require("chalk");

const emptyList = () => {
  console.log(
    chalk.hex("e67e22")(
      "Your list is empty.",
      chalk.hex("fff")(`Stuck? Try 'doo --help'`)
    )
  );
}
const listTasks = (data) => {
  data.forEach((board) =>
    board.tasks.forEach((task) => {
      console.log(task.taskName);
    })
  );
};

module.exports = {
  emptyList,
  listTasks,

};
