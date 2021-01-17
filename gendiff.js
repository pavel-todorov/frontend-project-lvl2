var fs = require('fs');
var lodash = require('lodash');

module.exports = async function (path1, path2) { 
  class ResultItem {
    constructor(state, key, value)  {
      this.state = state;
      this.key = key;
      this.value = value;
    }

    toString() {
      return `  ${this.state} ${this.key}: ${this.value}`
    }
  }

  console.log(`Source:\n${path1}\n${path2}`);
  try {
    const resultArray = [];
    const readFilesResults = await Promise.all(
      [fs.promises.readFile(path1),
      fs.promises.readFile(path2)]);
    const [object1, object2] = readFilesResults.map((item) => JSON.parse(item));

    lodash.forIn(object1, (value, key) => {
      const obj2Value = lodash.get(object2, key);
      console.log(`Object 1: ${key} -> ${value} (object2: ${obj2Value})`);
      if (value === obj2Value) {
        resultArray.push(new ResultItem(' ', key, value));
      } else if (obj2Value === undefined) {
        resultArray.push(new ResultItem('+', key, value));
      } else if (obj2Value != value) {
        resultArray.push(new ResultItem('+', key, value));
        resultArray.push(new ResultItem('-', key, value));
      }
    });
    return resultArray.map((item) => item.toString()).join('\n');
  }
  catch(err) {
    return err;
  }
};
