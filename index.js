#!/usr/bin/env node
const assert = require("assert");
const { pass, loading } = require("./util/actions");
const { PrettyError } = require("./util/pretty-error");
const diggedFiles = require("./util/walk").files;
const path = require("path");
const _ = require("lodash");
const chalk = require("chalk");
const getCallerFile = require("get-caller-file");

let passed = 0;
let failed = 0;
let suites = 0;
let tests = [];
let failedSuites = [];
let logs = {};

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

  tests.push({ name, fn, file: getCallerFile() });
}

function main() {
  for (let test of tests) {
    try {
      let now = new Date().getTime();
      test.fn(assert);
      pass(test.name, new Date().getTime() - now);
      ++passed;
    } catch (error) {
      if (!failedSuites.includes(test.file)) failedSuites.push(test.file);
      new PrettyError(error, test.name, test.file);
      ++failed;
    }
  }

  setTimeout(() => {
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
  }, failed * 30);
}

global.test = test;
global.console.langoor = function (...data) {
  let file = getCallerFile();
  if (!(file in logs)) {
    logs[file] = data;
  } else {
    logs[file] = logs[file].concat(data);
  }
};

files = _.uniqWith(
  process.argv
    .slice(2)
    .concat(diggedFiles)
    .map((file) => path.resolve(".", file)),
  _.isEqual
);

files.forEach((file) => {
  ++suites;
  loading(file);
  require(file);
});

main();
