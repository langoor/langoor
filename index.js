#!/usr/bin/env node
const assert = require("assert");
const { pass, loading, fail, fileActions } = require("./util/actions");
const { PrettyError } = require("./util/pretty-error");
const diggedFiles = require("./util/walk").files;
const path = require("path");
const _ = require("lodash");
const chalk = require("chalk");
const boxen = require("boxen");
const getCallerFile = require("get-caller-file");
const { performance } = require("perf_hooks");

let passed = 0;
let failed = 0;
let suites = 0;
let tests = [];
let failedSuites = [];
let passedSuites = [];

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
      let now = performance.now();
      test.fn(assert);
      pass(test.name, Math.round(performance.now() - now));
      ++passed;
    } catch (error) {
      if (!failedSuites.includes(test.file)) failedSuites.push(test.file);
      new PrettyError(error, test.name, test.file);
      ++failed;
    }
  }

  setTimeout(() => {
    const template = chalk.hex("#4DA8DA").underline.bold;
    let res = [];
    const respush = (...strings) => {
      res.push(strings.join(" "));
    };

    console.log();
    console.log(chalk.bgMagenta.black(" RESULT "));

    respush(
      template("Suites:"),
      chalk.green(`${suites - failedSuites.length} passed`),
      "|",
      chalk.red(`${failedSuites.length} failed`),
      "|",
      chalk.white(`${suites} total`)
    );

    respush(
      template("Tests:"),
      chalk.green(`${passed} passed`),
      "|",
      chalk.red(`${failed} failed`),
      "|",
      chalk.white(`${tests.length} total`)
    );

    console.log(boxen(res.join("\n"), { borderStyle: "round", padding: 1 }));
  }, failed * 100);
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
