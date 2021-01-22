const lodash = require('lodash');
const { ResultArray, ResultItem } = require('./getdiff-helpers');
const { getObject } = require('./parsers');
const { sortAsc } = require('./utils/sorters');
const { createFormatter } = require('./formatters/formatter');

const getObjectsFields = (src, path = '') => {
  const result = [];
  let obj = src;
  let pathPrefix = '';
  if (path !== '') {
    obj = lodash.get(src, path);
    pathPrefix = `${path}.`;
  }
  lodash.forIn(obj, (value, key) => {
    const fullKey = `${pathPrefix}${key}`;
    result.push(fullKey);
    if (typeof value === 'object' && value !== null) {
      result.push(...getObjectsFields(src, fullKey));
      result.push(`${fullKey}<<<<<`);
    }
  });
  return result;
};

const isObjectAndNotNull = (src) => (typeof src === 'object' && src !== null);

const isNotSpecialCase = (caseValue, field) => (caseValue === undefined
  || !lodash.startsWith(field, caseValue));

const isNeedToAddSpecialCase = (caseValue, field) => (caseValue === undefined)
  || !lodash.startsWith(field, caseValue);

const checkIsNotSpecialCaseAndGenerateItem = (caseValue, field, type, value = undefined) => {
  if (isNotSpecialCase(caseValue, field)) {
    return new ResultItem(type, field, value);
  }
  return new ResultItem(' ', field, value);
};

const compareObjectsByFields = (object1, object2, fields) => {
  const resultArray = new ResultArray();
  const specialCases = {
    lastInGroup: new Map(),
    checkGroupAdded: undefined,
    checkGroupRemoved: undefined,
  };
  fields.forEach((field) => {
    if (lodash.endsWith(field, '<<<<<')) {
      resultArray.push(new ResultItem('<', field));
      if (!lodash.startsWith(field, specialCases.checkGroupAdded)) {
        specialCases.checkGroupAdded = undefined;
      }
      if (!lodash.startsWith(field, specialCases.checkGroupRemoved)) {
        specialCases.checkGroupRemoved = undefined;
      }
    } else {
      const value1 = lodash.get(object1, field);
      const value2 = lodash.get(object2, field);
      if (isObjectAndNotNull(value1) && isObjectAndNotNull(value2)) {
        resultArray.push(new ResultItem(' ', field));
      } else if (value1 === undefined && isObjectAndNotNull(value2)) {
        resultArray.push(checkIsNotSpecialCaseAndGenerateItem(specialCases.checkGroupAdded, field, '+'));
        if (isNeedToAddSpecialCase(specialCases.checkGroupAdded, field)) {
          specialCases.checkGroupAdded = field;
        }
      } else if (isObjectAndNotNull(value1) && value2 === undefined) {
        resultArray.push(checkIsNotSpecialCaseAndGenerateItem(specialCases.checkGroupRemoved, field, '-'));
        if (isNeedToAddSpecialCase(specialCases.checkGroupRemoved, field)) {
          specialCases.checkGroupRemoved = field;
        }
      } else if (isObjectAndNotNull(value1) && !isObjectAndNotNull(value2)) {
        resultArray.push(new ResultItem('-', field));
        if (isNeedToAddSpecialCase(specialCases.checkGroupRemoved, field)) {
          specialCases.checkGroupRemoved = field;
        }
        specialCases.lastInGroup.set(field, new ResultItem('+', field, value2));
      } else if (!isObjectAndNotNull(value1) && isObjectAndNotNull(value2)) {
        resultArray.push(new ResultItem('-', field, value1));
        resultArray.push(new ResultItem('+', field));
      } else if (!isObjectAndNotNull(value1) && value2 === undefined) {
        // console.log(`CheckRemoved: ${specialCases.checkGroupRemoved}`);
        resultArray.push(checkIsNotSpecialCaseAndGenerateItem(specialCases.checkGroupRemoved, field, '-', value1));
      } else if (value1 === undefined && !isObjectAndNotNull(value2)) {
        // console.log(`CheckAdded: ${specialCases.checkGroupAdded}`);
        resultArray.push(checkIsNotSpecialCaseAndGenerateItem(specialCases.checkGroupAdded, field, '+', value2));
      } else if (!isObjectAndNotNull(value1) && !isObjectAndNotNull(value2)) {
        if (value1 === value2) {
          resultArray.push(new ResultItem(' ', field, value1));
        } else {
          resultArray.push(new ResultItem('-', field, value1));
          resultArray.push(new ResultItem('+', field, value2));
        }
      }
      // console.log(`Result: ${resultArray.data.map((item) => item.toString()).join('\n')}`);
    }
  });
  // console.log(`SpecialCases: ${JSON.stringify(specialCases)}`);
  if (specialCases.lastInGroup.size > 0) {
    specialCases.lastInGroup.forEach((toAdd, key) => {
      // console.log(`Special case (to add): ${key} -> ${toAdd}`);
      resultArray.insertAfterClosedKey(key, toAdd);
    });
  }
  // console.log(`>>>Result: ${resultArray.data.map((item) => item.toString()).join('\n')}`);
  return resultArray;
};

const getDiff = (path1, path2, formatter = 'stylish') => {
  try {
    // const resultArray = new ResultArray();
    const objects = [path1, path2].map((path) => ({ path, object: getObject(path) }));
    const error = objects.find((value) => value.object === undefined);
    if (error !== undefined) {
      return JSON.stringify({
        error: `Can't parse ${error.path} file.`,
      });
    }
    const [object1, object2] = objects.map((obj) => obj.object);

    const fields = lodash.union(getObjectsFields(object1), getObjectsFields(object2))
      .sort(sortAsc);
    // console.log(`Fields:\n${fields.join('\n')}`);
    const resultArray = compareObjectsByFields(object1, object2, fields);
    // console.log(`ResultArray: ${JSON.stringify(resultArray)}`);

    return createFormatter(formatter).format(resultArray);
  } catch (err) {
    return JSON.stringify({
      error: err,
    });
  }
};

module.exports = {
  getDiff,
};
