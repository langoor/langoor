const nthline = require("nthline");
const Parser = require("error-stack-parser");
const chalk = require("chalk");
const { fail } = require("./actions");

class PrettyError {
  constructor(err, testName, fileName) {
    this._parsedError = Parser.parse(err)[0];
    this._lineNumber = this._parsedError.lineNumber;
    this._fileName = this._parsedError.fileName;

    this.getLines().then((contents) => {
      fail(testName, fileName);
      console.log(chalk.bold("\t" + err.name + ": " + err.message));
      this.render(contents);
    });
  }

  async getLines() {
    let currentLine = this._lineNumber - 1;
    let mainContents = await nthline(currentLine, this._fileName);
    let upperContents = await nthline(currentLine - 1, this._fileName);
    let lowerContents = await nthline(currentLine + 1, this._fileName);
    return { mainContents, upperContents, lowerContents };
  }

  render({ mainContents, upperContents, lowerContents }) {
    let adjustedLineNumbers = [
      this._lineNumber - 1 + "",
      this._lineNumber + "",
      this._lineNumber + 1 + "",
    ];

    if (adjustedLineNumbers[2].length > adjustedLineNumbers[1].length) {
      adjustedLineNumbers[0] = adjustedLineNumbers[0] + " ";
      adjustedLineNumbers[1] = adjustedLineNumbers[1] + " ";
    }

    if (adjustedLineNumbers[1].length > adjustedLineNumbers[0].length) {
      adjustedLineNumbers[0] = adjustedLineNumbers[0] + " ";
    }

    console.log(
      `\t${chalk.gray`${adjustedLineNumbers[0]} | `}` + upperContents
    );
    console.log(
      `${" ".repeat(
        6
      )}${chalk.redBright`> `}${chalk.gray`${adjustedLineNumbers[1]} | `}` +
        chalk.bgRedBright.whiteBright(mainContents)
    );
    console.log(
      `\t${chalk.gray`${adjustedLineNumbers[2]} | `}` + lowerContents
    );
  }
}

module.exports = { PrettyError };
