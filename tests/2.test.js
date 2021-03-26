console.langoor("File 2 here!");
test("should yield 4 (2 + 2)", ({ equal }) => {
  equal(2 + 2, 4);
});

test("should yield 100 (2 * 50)", ({ equal }) => {
  equal(2 * 50, 100);
});

test("should yield 1000000000000000000000000000000 (1000000000000 * 1000000000000000000)", ({
  equal,
}) => {
  equal(1000000000000 * 1000000000000000000, 1000000000000000000000000000000);
});

test("should yield 1 (3/3)", ({ equal }) => {
  equal(3 / 3, 1);
});

test("should yield 8 (2 ^ 3)", ({ equal }) => {
  equal(2 ** 3, 7);
});

test("should yield 200 (100 * 2)", ({ equal }) => {
  equal(100 * 2, 300);
});

test("should log 'Langoor rocks!'", () => {
  console.langoor("Langoor rocks!");
});
