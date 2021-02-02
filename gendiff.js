/* eslint fp/no-mutating-methods: ["off"] */
/* eslint fp/no-mutation: ["off"] */
/* eslint fp/no-let: ["off"] */
const _ = require('lodash');
const { ResultItem } = require('./getdiff-helpers');
const { getObject } = require('./parsers');
const createFormatter = require('./formatters/index');
const { sortAscByKey } = require('./utils/sorters');

const isObjectAndNotNull = (src) => (typeof src === 'object' && src !== null);

const isUndefined = (value) => value === undefined;

const isNotObjectAndNotNull = (src) => (typeof src !== 'object' && src !== null);

const findNewFields = (object1, object2, path = '') => {
  let obj1 = object1;
  let obj2 = object2;
  let pathPrefix = '';
  if (path !== '') {
    obj1 = _.get(object1, path);
    obj2 = _.get(object2, path);
    pathPrefix = `${path}.`;
  }
  const res = [];
  _.forIn(obj2, (value2, key) => {
    const fullKey = `${pathPrefix}${key}`;
    const value1 = _.get(obj1, key);
    if (isUndefined(value1) && !isUndefined(value2)) {
      res.push(new ResultItem('+', fullKey, value2));
    }
  });
  return res;
};

const compareObjects = (object1, object2, path = '') => {
  let obj1 = object1;
  let obj2 = object2;
  let pathPrefix = '';
  if (path !== '') {
    obj1 = _.get(object1, path);
    obj2 = _.get(object2, path);
    pathPrefix = `${path}.`;
  }
  const res = [];
  let currentItem;
  _.forIn(obj1, (value1, key) => {
    const fullKey = `${pathPrefix}${key}`;
    const value2 = _.get(obj2, key);
    if (isObjectAndNotNull(value1) && isUndefined(value2)) {
      res.push(new ResultItem('-', fullKey, value1));
    } else if (isObjectAndNotNull(value1) && isObjectAndNotNull(value2)) {
      currentItem = new ResultItem(' ', fullKey);
      currentItem.addSubItems(compareObjects(object1, object2, fullKey));
      res.push(currentItem);
    } else if (isNotObjectAndNotNull(value1) && isUndefined(value2)) {
      res.push(new ResultItem('-', fullKey, value1));
    } else if (value1 !== value2) {
      res.push(new ResultItem('-', fullKey, value1));
      res.push(new ResultItem('+', fullKey, value2));
    } else {
      res.push(new ResultItem(' ', fullKey, value1));
    }
  });
  findNewFields(object1, object2, path).forEach((item) => res.push(item));
  res.sort(sortAscByKey);
  return res;
};

const genDiff = (path1, path2, formatter = 'stylish') => {
  try {
    const objects = [path1, path2].map((path) => ({ path, object: getObject(path) }));
    const error = objects.find((value) => value.object === undefined);
    if (error !== undefined) {
      return JSON.stringify({
        error: `Can't parse ${error.path} file.`,
      });
    }
    const [object1, object2] = objects.map((obj) => obj.object);
    const res = compareObjects(object1, object2);

    return createFormatter(formatter).format(res);
  } catch (err) {
    return JSON.stringify({
      error: err,
    });
  }
};

module.exports = genDiff;
