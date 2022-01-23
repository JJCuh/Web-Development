const chalk = require("chalk");

class JestGradeReporter {
  /*
   Should match all strings formatted with braces and a number inside at the 
   beginning (ex: [10])
   */
  static POINTS_REGEX = /^\s?[[0-9]*\]/;

  constructor(globalConfig, options) {
    this._points = 0;
    this._totalPoints = options.total;
  }

  onRunComplete(contexts, results) {
    const percent = (this._points / this._totalPoints) * 100;

    if (percent < 50) {
      console.log(chalk.red(`Score: ${this._points} / ${this._totalPoints}`));
    } else if (percent < 80) {
      console.log(
        chalk.yellow(`Score: ${this._points} / ${this._totalPoints}`)
      );
    } else {
      console.log(chalk.green(`Score: ${this._points} / ${this._totalPoints}`));
    }
  }

  onTestCaseResult(_, testCaseResult) {
    const match = testCaseResult.title.match(JestGradeReporter.POINTS_REGEX);

    if (!match) {
      return;
    }

    // extract the number from the match
    const pointNumeral = match[0].match(/\d*/g);
    const value = parseInt(pointNumeral[1], 10);

    const passed = testCaseResult.status === "passed";
    const addPointsOnFail = match[0].includes("!");

    if (addPointsOnFail && !passed) {
      this._points -= value;
    } else if (!addPointsOnFail && passed) {
      this._points += value;
    }
  }
}

module.exports = JestGradeReporter;
