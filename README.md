# 🐒 Langoor

## Features

- 🎁 One of the best visual rendering used.
- 🎄 Excellent error rendering.
- 🎀 Automatically searches for files ending with ".test.js" in your root folder.
- 🕸️ Uses the "assert" package to check equality and other features.

## Demo

![Langoor Demo](https://i.postimg.cc/VkjYWwSP/langoor-demo.png)

## Installation

```bash
# using npm
npm install langoor

# using yarn
yarn add langoor

# installing GLOBALLY
npm install --global langoor
```

## Usage

```bash
# auto-searches files ending with ".test.js"
langoor
```

#### If you want to add custom files to the pre-existing ones

```bash
langoor <file_path>
```

## File Usage

```js
test("should give 2 + 2 = 4", (assert) => {
  /*                           ^^^^^^
    the "assert" package can be accessed here */
  assert.equal(2 + 2, 4);
});
```

## To-do list

- Adding configuration features from user's side.
- Making our own assertion features rather than using assert.
- Making the performance better.
