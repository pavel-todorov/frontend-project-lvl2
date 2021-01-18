const fs = require('fs');
const lodash = require('lodash');
const { ResultArray, ResultItem } = require('./getdiff-helpers');

module.exports = function getDiff(path1, path2) {
  // console.log(`Source:\n${path1}\n${path2}`);
  try {
    const resultArray = new ResultArray();
    const object1 = JSON.parse(fs.readFileSync(path1));
    const object2 = JSON.parse(fs.readFileSync(path2));

    lodash.forIn(object1, (value, key) => {
      const obj2Value = lodash.get(object2, key);
      // console.log(`Object 1: ${key} -> ${value} (object2: ${obj2Value})`);
      if (value === obj2Value) {
        resultArray.push(new ResultItem(' ', key, value));
      } else if (obj2Value === undefined) {
        resultArray.push(new ResultItem('-', key, value));
      } else if (obj2Value !== value) {
        resultArray.push(new ResultItem('-', key, value));
        resultArray.push(new ResultItem('+', key, obj2Value));
      }
    });
    lodash.forIn(object2, (value, key) => {
      const obj1Value = lodash.get(object1, key);
      // console.log(`Object 2: ${key} -> ${value} (object1: ${obj1Value})`);
      if (obj1Value === undefined) {
        resultArray.push(new ResultItem('+', key, value));
      }
    });
    return `{\n${resultArray.toString()}\n}`;
  } catch (err) {
    return err;
  }
};
