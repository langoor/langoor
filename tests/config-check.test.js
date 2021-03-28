const config = require("../util/config-check")();
test("should display the right config", ({ deepEqual }) => {
  deepEqual(config, {
    additional: [], // Additional Files to add to the default ".test.js" files.
    ignore: [], // Ignored files and folders.
  });
});
