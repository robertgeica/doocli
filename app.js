#!/usr/bin/env node

const yargs = require("yargs");
const axios = require("axios");
const keytar = require("keytar");
const chalk = require("chalk");

// register user
yargs.command({
  command: "register",
  describe: "register user",

  async handler(argv) {
    // console.log(argv._[1], argv._[2]);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ email: argv._[1], password: argv._[2] });

    try {
      const res = await axios.post(
        "http://localhost:4000/api/register",
        body,
        config
      );
    } catch (error) {
      if (error) {
        console.log("Error", error);
      }
    }
  },
});

// login user
yargs.command({
  command: "login",
  describe: "login user",

  async handler(argv) {
    // console.log(argv._[1], argv._[2]);

    try {
      const body = { email: argv._[1], password: argv._[2] };
      const res = await axios.post("http://localhost:4000/api/auth", body);

      keytar.setPassword("doocli", "user", res.data.token);
      console.log(res.data.token);
    } catch (error) {
      if (error) {
        console.log("Error", error);
      }
    }
  },
});

// list tasks
yargs.command({
  command: "list",
  describe: "list all todos",

  async handler() {
    const user = keytar.getPassword("doocli", "user");

    try {
      const token = await user;
      let config = {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      };

      const req = await axios.get(`http://localhost:4000/api/board`, config);

      const data = req.data;
      if (data == undefined) {
        return console.log(
          chalk.hex("e67e22")(
            "Your list is empty.",
            chalk.hex("fff")(`Stuck? Try 'doo --help'`)
          )
        );
      }

      data.forEach((board) =>
        board.tasks.forEach((task) => {
          console.log(task.taskName);
        })
      );
    } catch (error) {
      if (error) {
        console.log("Error", error);
      }
    }
  },
});

yargs.command({
  command: "cb",
  describe: "create board",

  async handler(argv) {
    console.log(argv._[1]);

    const user = keytar.getPassword("doocli", "user");

    try {
      const boardObj = { boardName: argv._[1], tasks: [] };
      const token = await user;

      let config = {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      };
      await axios.post("http://localhost:4000/api/board", boardObj, config);
    } catch (error) {
      if (error) {
        console.log("Error", error);
      }
    }
  },
});

yargs.command({
  command: "add",
  describe: "add task",

  async handler(argv) {
    // console.log(argv._[1], argv._[2]);

    const user = keytar.getPassword("doocli", "user");

    try {
      const token = await user;
      let config = {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      };

      const board = await axios.get(
        `http://localhost:4000/api/board/${argv._[2]}`,
        config
      );
      if (board.data.length === 0) return console.log("board did not exist");

      const taskObj = {
        id: 0,
        taskName: argv._[1],
        taskComplete: false,
        taskPriority: "",
        dueDate: Date.now(),
        trackedSessions: {},
        isArchieved: false,
        createdAt: Date.now(),
      };

      const updatedBoard = {
        ...board.data[0],
        tasks: [...board.data[0].tasks, taskObj],
      };

      console.log(updatedBoard);
      await axios.put(
        `http://localhost:4000/api/board/${argv._[2]}`,
        updatedBoard,
        config
      );
    } catch (error) {
      if (error) {
        console.log("Error", error);
      }
    }
  },
});

// stop time
yargs.parse();
