const acts = require("../util/actions");
test("should log fails etc.", () => {
  acts.fail("__test__", __filename);
  acts.pass("__test__", 0);
  acts.loading("__test__");
});
