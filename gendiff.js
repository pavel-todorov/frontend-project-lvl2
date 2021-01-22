const lodash = require('lodash');
const { ResultArray, ResultItem } = require('./getdiff-helpers');
const { getObject } = require('./parsers');
const { sortAsc } = require('./utils/sorters');
const { createFormatter } = require('./formatters/index');

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

const isNotObjectAndNotNull = (src) => !isObjectAndNotNull(src);

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

const computeSpecialCase = (caseValue, field) => {
  if (isNeedToAddSpecialCase(caseValue, field)) {
    return field;
  }
  return caseValue;
};

const isUndefined = (value) => value === undefined;

const checkMatrix = [
  {
    check: [isObjectAndNotNull, isObjectAndNotNull],
    do: (resultArray, specialCases, field) => {
      resultArray.push(new ResultItem(' ', field));
    },
  },
  {
    check: [isUndefined, isObjectAndNotNull],
    do: (resultArray, specialCases, field) => {
      resultArray.push(checkIsNotSpecialCaseAndGenerateItem(specialCases.checkGroup.get('+'), field, '+'));
      if (isNeedToAddSpecialCase(specialCases.checkGroup.get('+'), field)) {
        specialCases.checkGroup.set('+', field);
      }
    },
  },
  {
    check: [isObjectAndNotNull, isUndefined],
    do: (resultArray, specialCases, field) => {
      resultArray.push(checkIsNotSpecialCaseAndGenerateItem(specialCases.checkGroup.get('-'), field, '-'));
      specialCases.checkGroup.set('-', computeSpecialCase(specialCases.checkGroup.get('-'), field));
    },
  },
  {
    check: [isObjectAndNotNull, isNotObjectAndNotNull],
    do: (resultArray, specialCases, field, value1, value2) => {
      resultArray.push(new ResultItem('-', field));
      specialCases.checkGroup.set('-', computeSpecialCase(specialCases.checkGroup.get('-'), field));
      specialCases.lastInGroup.set(field, new ResultItem('+', field, value2));
    },
  },
  {
    check: [isNotObjectAndNotNull, isObjectAndNotNull],
    do: (resultArray, specialCases, field, value1) => {
      resultArray.push(new ResultItem('-', field, value1));
      resultArray.push(new ResultItem('+', field));
    },
  },
  {
    check: [isNotObjectAndNotNull, isUndefined],
    do: (resultArray, specialCases, field, value1) => {
      resultArray.push(checkIsNotSpecialCaseAndGenerateItem(specialCases.checkGroup.get('-'), field, '-', value1));
    },
  },
  {
    check: [isUndefined, isNotObjectAndNotNull],
    do: (resultArray, specialCases, field, value1, value2) => {
      resultArray.push(checkIsNotSpecialCaseAndGenerateItem(specialCases.checkGroup.get('+'), field, '+', value2));
    },
  },
  {
    check: [isNotObjectAndNotNull, isNotObjectAndNotNull],
    do: (resultArray, specialCases, field, value1, value2) => {
      if (value1 === value2) {
        resultArray.push(new ResultItem(' ', field, value1));
      } else {
        resultArray.push(new ResultItem('-', field, value1));
        resultArray.push(new ResultItem('+', field, value2));
      }
    },
  },
];

const compareObjectsByFields = (object1, object2, fields) => {
  const resultArray = new ResultArray();
  const specialCases = { lastInGroup: new Map(), checkGroup: new Map() };
  fields.forEach((field) => {
    if (lodash.endsWith(field, '<<<<<')) {
      resultArray.push(new ResultItem('<', field));
      ['+', '-'].forEach((sign) => {
        if (!lodash.startsWith(field, specialCases.checkGroup.get(sign))) {
          specialCases.checkGroup.set(sign, undefined);
        }
      });
    } else {
      const value1 = lodash.get(object1, field);
      const value2 = lodash.get(object2, field);
      checkMatrix.some((check) => {
        const isOk = check.check[0](value1) && check.check[1](value2);
        if (isOk) {
          check.do(resultArray, specialCases, field, value1, value2);
        }
        return isOk;
      });
    }
  });
  specialCases.lastInGroup.forEach((toAdd, key) => { resultArray.insertAfter(key, toAdd); });
  return resultArray;
};

const getDiff = (path1, path2, formatter = 'stylish') => {
  try {
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
    const resultArray = compareObjectsByFields(object1, object2, fields);

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
