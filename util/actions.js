const chalk = require("chalk");

const pass = (name, time) => {
  console.log(chalk.bgGreen.black` PASS `, chalk.green(name), `(${time}ms)`);
};

const fail = (name, filename) => {
  console.log(
    chalk.bgRed.black` FAIL `,
    chalk.red(name),
    `at ${chalk.yellow(filename)}`
  );
};

const loading = (fileName) => {
  console.log(chalk.bgYellow.black` LOADING `, fileName);
};

module.exports = { pass, fail, loading };
