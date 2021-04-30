#!/usr/bin/env node

const yargs = require("yargs");
const axios = require("axios");
const keytar = require("keytar");

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
      
      keytar.setPassword('doocli', 'user', res.data.token);
      
    } catch (error) {
      if (error) {
        console.log("Error", error);
      }
    }
  },
});



// stop time
yargs.parse();
