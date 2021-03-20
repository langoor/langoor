#!/usr/bin/env node
const assert = require("assert");
const { pass, loading } = require("./util/actions");
const validate = require("./util/validate");
const { PrettyError } = require("./util/pretty-error");
const diggedFiles = require("./util/walk").files;
const path = require("path");
const _ = require("lodash");
const chalk = require("chalk");
const boxen = require("boxen");

let passed = 0;
let failed = 0;
let suites = 0;
let tests = [];

function test(name, fn) {
  if (!validate(name, "string")) {
    throw new TypeError(
      'Name should be type string. Got "' + typeof name + '".'
    );
  }

  if (!validate(fn, "function")) {
    throw new TypeError(
      'Callback should be type function. Got "' + typeof fn + '".'
    );
  }

  tests.push({ name, fn, dirname: __filename });
}

function run() {
  tests.forEach((test) => {
    try {
      let now = Date.now();
      test.fn(assert);
      pass(test.name, Date.now() - now);
      ++passed;
    } catch (error) {
      new PrettyError(error, test.name);
      ++failed;
    }
  });

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
