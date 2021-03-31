const diff = require("./functions/diff.test");
const div = require("./functions/div.test");
const product = require("./functions/product.test");
const sum = require("./functions/sum.test");

test("sum should be 7", () => {
  hope(sum(2, 2, 3)).toStrictEqual(7);
});

test("diff should be 2", () => {
  hope(diff(5, 3)).toStrictEqual(2);
});

test("product should be 27", () => {
  hope(product(3, 3, 3)).toStrictEqual(27);
});

test("division should be 2", () => {
  hope(div(6, 3)).toStrictEqual(2);
});

console.langoor("Langoor rockzzz");
