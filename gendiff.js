const lodash = require('lodash');
const { ResultArray, ResultItem } = require('./getdiff-helpers');
const { getObject } = require('./parsers');

const compareForward = (object1, object2) => {
  const resultArray = [];
  lodash.forIn(object1, (value, key) => {
    const obj2Value = lodash.get(object2, key);
    if (value === obj2Value) {
      resultArray.push(new ResultItem(' ', key, value));
    } else if (obj2Value === undefined) {
      resultArray.push(new ResultItem('-', key, value));
    } else if (obj2Value !== value) {
      resultArray.push(new ResultItem('-', key, value));
      resultArray.push(new ResultItem('+', key, obj2Value));
    }
  });
  return resultArray;
};

const compareBackward = (object1, object2) => {
  const resultArray = [];
  lodash.forIn(object2, (value, key) => {
    const obj1Value = lodash.get(object1, key);
    if (obj1Value === undefined) {
      resultArray.push(new ResultItem('+', key, value));
    }
  });
  return resultArray;
};

module.exports = function getDiff(path1, path2) {
  try {
    const resultArray = new ResultArray();
    const objects = [path1, path2].map((path) => ({ path, object: getObject(path) }));
    const error = objects.find((value) => value.object === undefined);
    if (error !== undefined) {
      return JSON.stringify({
        error: `Can't parse ${error.path} file.`,
      });
    }
    const [object1, object2] = objects.map((obj) => obj.object);

    resultArray.pushAll(compareForward(object1, object2));
    resultArray.pushAll(compareBackward(object1, object2));
    return `{\n${resultArray.toString()}\n}`;
  } catch (err) {
    return JSON.stringify({
      error: err,
    });
  }
};
