const lodash = require('lodash');
const { ResultArray, ResultItem } = require('./getdiff-helpers');
const { getObject } = require('./parsers');

const compareForward = (object1, object2, path = '') => {
  let obj1 = object1;
  let obj2 = object2;
  let pathPrefix = '';
  if (path !== '') {
    obj1 = lodash.get(object1, path);
    obj2 = lodash.get(object2, path);
    pathPrefix = `${path}.`;
  }
  const resultArray = [];
  lodash.forIn(obj1, (value, key) => {
    const fullKey = `${pathPrefix}${key}`;
    const obj2Value = lodash.get(obj2, key);
    if (typeof value === 'object') {
      if (obj2Value === undefined || (typeof obj2Value !== 'object')) {
        resultArray.push(new ResultItem('-', fullKey));
      } else {
        resultArray.push(new ResultItem(' ', fullKey));
      }
      resultArray.push(...compareForward(object1, object2, `${pathPrefix}${key}`));
    } else if (value === obj2Value) {
      resultArray.push(new ResultItem(' ', fullKey, value));
    } else if (obj2Value === undefined) {
      resultArray.push(new ResultItem('-', fullKey, value));
    } else if (obj2Value !== value) {
      resultArray.push(new ResultItem('-', fullKey, value));
      resultArray.push(new ResultItem('+', fullKey, obj2Value));
    }
  });
  return resultArray;
};

const compareBackward = (object1, object2, path = '') => {
  let obj1 = object1;
  let obj2 = object2;
  let pathPrefix = '';
  if (path !== '') {
    obj1 = lodash.get(object1, path);
    obj2 = lodash.get(object2, path);
    pathPrefix = `${path}.`;
  }
  const resultArray = [];
  lodash.forIn(obj2, (value, key) => {
    const fullKey = `${pathPrefix}${key}`;
    const obj1Value = lodash.get(obj1, key);
    if (typeof value === 'object') {
      if (obj1Value === undefined) {
        resultArray.push(new ResultItem('+', fullKey));
      }
      resultArray.push(...compareBackward(object1, object2, fullKey));
    } else if (obj1Value === undefined) {
      resultArray.push(new ResultItem('+', fullKey, value));
    }
  });
  return resultArray;
};

const getDiff = (path1, path2) => {
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

    // console.log(compareForward(object1, object2));
    resultArray.pushAll(compareForward(object1, object2));
    resultArray.pushAll(compareBackward(object1, object2));
    return `{\n${resultArray.toString()}\n}`;
  } catch (err) {
    return JSON.stringify({
      error: err,
    });
  }
};

module.exports = {
  getDiff,
  compareForward,
  compareBackward,
};
