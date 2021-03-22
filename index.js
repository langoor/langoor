#!/usr/bin/env node
const assert = require("assert");
const { pass, loading } = require("./util/actions");
const { PrettyError } = require("./util/pretty-error");
const diggedFiles = require("./util/walk").files;
const path = require("path");
const _ = require("lodash");
const chalk = require("chalk");
const boxen = require("boxen");
const getCallerFile = require("get-caller-file");

let passed = 0;
let failed = 0;
let suites = 0;
let tests = [];

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

function run() {
  for (let test of tests) {
    try {
      let now = Date.now();
      test.fn(assert);
      pass(test.name, Date.now() - now);
      ++passed;
    } catch (error) {
      new PrettyError(error, test.name, test.file);
      ++failed;
    }
  }

  setTimeout(() => {
    const template = chalk.hex("#4DA8DA").underline.bold;
    let res = [];
    const log = (...strings) => {
      res.push(strings.join(" "));
    };

    console.log();
    console.log(chalk.bgMagenta.black(" RESULT "));
    log(chalk.green.bold.underline("Passed:"), passed);
    log(chalk.red.bold.underline("Failed:"), failed);
    log(template("Total Tests:"), tests.length);
    log(template("Total Test Suites:"), suites);

    console.log(boxen(res.join("\n"), { borderStyle: "round", padding: 1 }));
  }, failed * 30);
}

global.test = test;

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

run();
