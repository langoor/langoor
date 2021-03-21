const nthline = require("nthline");
const Parser = require("error-stack-parser");
const chalk = require("chalk");
const { fail } = require("./actions");

class PrettyError {
  constructor(err, testName) {
    this._parsedError = Parser.parse(err)[0];
    this._lineNumber = this._parsedError.lineNumber;
    this._fileName = this._parsedError.fileName;

    this.getLines().then((contents) => {
      fail(testName);
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
    const spaces = (n) => " ".repeat(n);
    const errorLineMark = chalk.redBright`> `;
    const errorLineHighlight = chalk.bgRed.white.bold;
    const lengthInterval = [
      spaces(
        (this._lineNumber + 1).toString().length -
          (this._lineNumber - 1).toString().length
      ),
      spaces(
        (this._lineNumber + 1).toString().length -
          this._lineNumber.toString().length
      ),
    ];

    const mainLineNumber = chalk.blackBright(
      this._lineNumber + lengthInterval[1] + " |"
    );
    const upperLineNumber = chalk.blackBright(
      this._lineNumber - 1 + lengthInterval[0] + " |"
    );
    const lowerLineNumber = chalk.blackBright(this._lineNumber + 1 + " |");

    let upperLine = `${spaces(8)}${upperLineNumber} ${upperContents}`;

    let mainLine = `${spaces(
      6
    )}${errorLineMark}${mainLineNumber} ${errorLineHighlight(mainContents)}`;

    let lowerLine = `${spaces(8)}${lowerLineNumber} ${lowerContents}`;

    console.log(upperLine);
    console.log(mainLine);
    console.log(lowerLine);
  }
}

module.exports = { PrettyError };
