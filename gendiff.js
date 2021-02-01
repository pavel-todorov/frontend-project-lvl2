const _ = require('lodash');
const { ResultItem } = require('./getdiff-helpers');
const { getObject } = require('./parsers');
const { createFormatter } = require('./formatters/index');

const isObjectAndNotNull = (src) => (typeof src === 'object' && src !== null);

const isUndefined = (value) => value === undefined;

const isNotObjectAndNotNull = (src) => (typeof src !== 'object' && src !== null);

const findNewFields = (object1, object2, path = '') => {
  // console.log(`findNewFields ('${path}'): `);
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
      // res.push(`${fullKey}: {null} -> ${JSON.stringify(value2)}`);
      res.push(new ResultItem('+', fullKey, value2));
    }
  });
  // console.log(`findNewFields: ${JSON.stringify(res)}`);
  return res;
};

const compareObjects = (object1, object2, path = '') => {
  // console.log(`compareObjects ('${path}'): `);
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
    // console.log(`${fullKey}: ${JSON.stringify(value1)} -> ${JSON.stringify(value2)}`);
    if (isObjectAndNotNull(value1) && isUndefined(value2)) {
      // res.push(`${fullKey}: ${JSON.stringify(value1)} -> {null}`);
      res.push(new ResultItem('-', fullKey, value1));
    } else if (isObjectAndNotNull(value1) && isObjectAndNotNull(value2)) {
      // res.push(`${fullKey}: -> ({)`);
      // res.push(...compareObjects(object1, object2, fullKey));
      // res.push(`${fullKey}: <- (})`);
      currentItem = new ResultItem(' ', fullKey);
      currentItem.addSubItems(compareObjects(object1, object2, fullKey));
      res.push(currentItem);
    } else if (isNotObjectAndNotNull(value1) && isUndefined(value2)) {
      res.push(new ResultItem('-', fullKey, value1));
    } else {
        if (value1 !== value2) {
        res.push(new ResultItem('-', fullKey, value1));
        res.push(new ResultItem('+', fullKey, value2));
      } else {
        res.push(new ResultItem(' ', fullKey, value1));
      }
    }
  });
  findNewFields(object1, object2, path).forEach((item) => res.push(item));
  // res.push(...findNewFields(object1, object2, path));
  // console.log(`compareObjects: ${JSON.stringify(res)}`);
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



    // console.log(`Array1: ${JSON.stringify(getObjectsFields(object1))}`);
    // console.log(`Array2: ${JSON.stringify(getObjectsFields(object2))}`);

    // const fields = _.unionWith(getObjectsFields(object1), getObjectsFields(object2),
    //   (a, b) => a.key === b.key && a.type === b.type)
    //   .sort(sortKeyTypeObjectAsc);
    // console.log(fields.map((field) => JSON.stringify(field)).join('\n'));
    // const resultArray = compareObjectsByFields(object1, object2, fields);

    // return createFormatter(formatter).format(resultArray);

    const res = compareObjects(object1, object2);

    // console.log(`CompareObjects: ${JSON.stringify(res)}`);

    return createFormatter(formatter).format(res);

    // console.log(res.join('\n'));
    // console.log(`${res.length}`);
    // console.log(JSON.stringify(res));

    // return JSON.stringify({ error: 'Not implemented' });
  } catch (err) {
    return JSON.stringify({
      error: err,
    });
  }
};

module.exports = genDiff;
