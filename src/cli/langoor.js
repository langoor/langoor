#!/usr/bin/env node
const assert = require("assert");
const { pass, loading } = require("../console-actions");
const { PrettyError } = require("../pretty-error");
const diggedFiles = require("langoor-walk").files;
const path = require("path");
const _ = require("lodash");
const chalk = require("chalk");
const getCallerFile = require("get-caller-file");
const { hope } = require("langoor-exceptions");

let passed = 0;
let failed = 0;
let suites = 0;
let tests = [];
let failedSuites = [];
let logs = {};
let printResult = () => {
  const template = chalk.bgHex("#4DA8DA").black;
  if (Object.keys(logs).length > 0) {
    console.log();
    console.log(chalk.bgMagenta.black(" LOGS "));
    Object.keys(logs).forEach((key) => {
      let filename = key;
      let log = logs[key];
      console.log(chalk.bold("• " + filename));
      log.forEach((l) => {
        console.log("\t" + l);
      });
    });
  }
  console.log();
  console.log(
    template(" Suites "),
    chalk.green(`${suites - failedSuites.length} passed`),
    "|",
    chalk.red(`${failedSuites.length} failed`),
    "|",
    chalk.white(`${suites} total`)
  );
  console.log(
    template(" Tests  "),
    chalk.green(`${passed} passed`),
    "|",
    chalk.red(`${failed} failed`),
    "|",
    chalk.white(`${tests.length} total`)
  );
};

function test(name, fn) {
  if (typeof name !== "string") {
    throw new TypeError(
      'Name should be type string. Got "' + typeof name + '".'
    );
  }

  if (typeof fn !== "function") {
    throw new TypeError(
      'Callback should be type function. Got "' + typeof fn + '".'
    );
  }

  // appending test to variables tests
  tests.push({ name, fn, file: getCallerFile() });
}

function main() {
  // running a for loop for all tests
  for (let test of tests) {
    try {
      // if test passes
      let now = new Date().getTime();
      test.fn(assert);
      pass(test.name, new Date().getTime() - now);
      ++passed;
    } catch (error) {
      // if test fails
      if (!failedSuites.includes(test.file)) failedSuites.push(test.file);
      new PrettyError(error, test.name, test.file);
      ++failed;
    }
  }
}

// Setting Global Variables
global.test = test; // test function
global.console.langoor = function (...data) {
  let file = getCallerFile();
  if (file in logs) {
    logs[file] = logs[file].concat(data);
  } else {
    logs[file] = data;
  }
}; // langoor log system
global.hope = hope; // assertion

// setting files
files = _.uniqWith(
  process.argv
    .slice(2)
    .concat(diggedFiles)
    .map((file) => path.resolve(".", file)),
  _.isEqual
);

// requiring files
files.forEach((file) => {
  ++suites;
  loading(file);
  require(file);
});

// running main function
main();

// handling result before exit
process.on("beforeExit", (code) => {
  if (code !== 0) return;
  printResult();
});
