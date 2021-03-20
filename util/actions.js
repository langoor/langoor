const chalk = require("chalk");

const pass = (name, time) => {
  console.log(chalk.bgGreen.black` PASS `, chalk.green(name), `(${time}ms)`);
};

const fail = (name) => {
  console.log(chalk.bgRed.black` FAIL `, chalk.red(name));
};

const loading = (fileName) => {
  console.log(chalk.bgYellow.black` LOADING `, fileName);
};

module.exports = { pass, fail, loading };
