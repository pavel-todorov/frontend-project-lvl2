/* eslint fp/no-mutating-methods: ["off"] */
const {
  isStateAdd,
  isStateRemove,
  isStateUpdate,
  getValuedItems,
} = require('./utils');

const valueToString = (value) => {
  const type = typeof value;
  if (value === null) {
    return null;
  }
  if (type === 'boolean') {
    return value;
  }
  if (type === 'undefined' || type === 'object') {
    return '[complex value]';
  }
  return `${value}`;
};

const itemArrayToString = (itemArray) => {
  const res = { changings: [] };
  const data = getValuedItems(itemArray);
  let skip = false;
  data.forEach((item, index) => {
    if (!skip) {
      const nextItem = data[index + 1];
      if (isStateAdd(item)) {
        res.changings.push({ property: item.key, was: 'added', toValue: valueToString(item.value) });
      } else if (isStateRemove(item, nextItem)) {
        res.changings.push({ property: item.key, was: 'removed' });
      } else if (isStateUpdate(item, nextItem)) {
        res.changings.push({
          property: item.key,
          was: 'updated',
          fromValue: valueToString(item.value),
          toValue: valueToString(nextItem.value),
        });
        skip = true;
      }
    } else {
      skip = false;
    }
  });
  return JSON.stringify(res);
};

module.exports = itemArrayToString;
