/* eslint fp/no-mutating-methods: ["off"] */
/* eslint fp/no-mutation: ["off"] */
const {
  isStateAdd,
  isStateRemove,
  isStateUpdate,
  getValuedItems,
} = require('./utils');

const valueToString = (value) => {
  const type = typeof value;
  if (value === null) {
    return 'null';
  }
  if (type === 'string') {
    return `'${value}'`;
  }
  if (type === 'undefined' || type === 'object') {
    return '[complex value]';
  }
  return `${value}`;
};

const itemArrayToString = (itemArray) => {
  const strings = [];
  const data = getValuedItems(itemArray);
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    const nextItem = data[i + 1];
    if (isStateAdd(item)) {
      strings.push(`Property '${item.key}' was added with value: ${valueToString(item.value)}`);
    } else if (isStateRemove(item, nextItem)) {
      strings.push(`Property '${item.key}' was removed`);
    } else if (isStateUpdate(item, nextItem)) {
      strings.push(`Property '${item.key}' was updated. From ${valueToString(item.value)} to ${valueToString(nextItem.value)}`);
      i += 1;
    }
  }
  return strings.join('\n');
};

module.exports = itemArrayToString;
