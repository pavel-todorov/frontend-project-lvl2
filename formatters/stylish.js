/* eslint fp/no-mutating-methods: ["off"] */
/* eslint fp/no-mutation: ["off"] */
const _ = require('lodash');

const objectToString = (offset, obj) => {
  const res = [];
  _.forIn(obj, (value, key) => {
    if (typeof value === 'object') {
      res.push(`${offset}  ${key}: {`);
      res.push(...objectToString(`${offset}    `, value));
      res.push(`${offset}  }`);
    } else {
      res.push(`${offset}  ${key}: ${value}`);
    }
  });
  return res;
};

const itemToString = (item) => {
  const offset = ' '.repeat(item.getKeyLevel() * 4 - 2);
  const prefix = `${offset}${item.state} ${item.getKeyToPrint()}: {`;
  const postfix = `${offset}  }`;
  if (item.hasSubItems()) {
    item.normalize();
    const subItems = item.subItems.map((subItem) => itemToString(subItem)).join('\n');
    return `${prefix}\n${subItems}\n${postfix}`;
  }
  const valType = typeof item.value;
  if (valType === 'object' && item.value !== null) {
    const newOffset = ' '.repeat((item.getKeyLevel() + 1) * 4 - 2);
    return `${prefix}\n${objectToString(newOffset, item.value).join('\n')}\n${postfix}`;
  }
  return `${offset}${item.state} ${item.getKeyToPrint()}: ${item.value}`;
};

const itemArrayToString = (itemArray) => {
  const body = itemArray.map((item) => itemToString(item)).join('\n');
  return `{\n${body}\n}`;
};

module.exports = itemArrayToString;
