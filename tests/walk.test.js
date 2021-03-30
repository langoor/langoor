const diggedFiles = require("../util/walk").files;

test("should display this file", () => {
  if (!diggedFiles.includes(__filename)) {
    throw new Error("Failed because could not find current file");
  }
  console.langoor("a", "b", "aee");
});
