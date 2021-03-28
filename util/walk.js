const fs = require("fs");
const { isArray } = require("lodash");
const path = require("path");
const config = require("./config-check")();
let files = isArray(config.additional)
  ? config.additional.map((file) => path.resolve(".", file))
  : [];
let ignored = isArray(config.ignore)
  ? config.ignore.map((file) => path.resolve(".", file))
  : [];

function walk(dir) {
  let dirFiles = fs.readdirSync(dir);
  dirFiles.forEach((file) => {
    let absolutePath = path.resolve(dir, file);
    if (
      file.startsWith("node_modules") ||
      ignored.some((file) => absolutePath.endsWith(file))
    )
      return;

    if (fs.statSync(absolutePath).isDirectory()) {
      walk(absolutePath);
    } else {
      if (file.endsWith(".test.js")) files.push(absolutePath);
    }
  });
}

walk(".");
module.exports = { files };
