const fs = require("fs");
const path = require("path");
let files = [];

function walk(dir) {
  let dirFiles = fs.readdirSync(dir);
  dirFiles.forEach((file) => {
    if (file.startsWith("node_modules") || file.startsWith(".git")) return;
    if (fs.statSync(path.resolve(dir, file)).isDirectory()) {
      walk(path.resolve(dir, file));
    } else {
      files.push(path.resolve(dir, file));
    }
  });
}

walk(".");
module.exports = { files: files.filter((f) => f.endsWith(".test.js")) };
