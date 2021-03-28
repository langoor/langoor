const fs = require("fs");
const { resolve } = require("path");
const configCheck = () => {
  if (!fs.existsSync("./langoor.config.js")) return {};
  let data = require(resolve(".", "langoor.config.js"));
  return data;
};
module.exports = configCheck;
