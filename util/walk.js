const fs = require("fs");
const path = require("path");
let files = [];

function walk(dir) {
  let dirFiles = fs.readdirSync(dir);
  dirFiles.forEach((file) => {
    let absolutePath = path.resolve(dir, file);
    if (file.startsWith("node_modules") || file.startsWith(".git")) return;
    if (fs.statSync(absolutePath).isDirectory()) {
      walk(absolutePath);
    } else {
      if (file.endsWith(".test.js")) files.push(absolutePath);
    }
  });
}

walk(".");
module.exports = { files };
