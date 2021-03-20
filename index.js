#!/usr/bin/env node
const assert = require("assert");
const { pass, loading } = require("./util/actions");
const validate = require("./util/validate");
const { PrettyError } = require("./util/pretty-error");

const path = require("path");
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
    } catch (error) {
      new PrettyError(error, test.name);
    }
  });
}

global.test = test;

const files = process.argv.slice(2).map((file) => path.resolve(".", file));
files.forEach((file) => {
  loading(file);
  require(file);
});

run();
