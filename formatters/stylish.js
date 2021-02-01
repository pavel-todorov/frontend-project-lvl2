const _ = require('lodash');

const objectToString = (offset, obj) => {
  let res = [];
  _.forIn(obj, (value, key) => {
    if (typeof value === 'object') {
      res = [...res, `${offset}  ${key}: {`];
      res = [...res, ...objectToString(`${offset}    `, value)];
      res = [...res, `${offset}  }`];
    } else {
      res = [...res, `${offset}  ${key}: ${value}`];
    }
  });
  return res;
};

const itemToString = (item) => {
  const offset = ' '.repeat(item.getKeyLevel() * 4 - 2);
  if (item.hasSubItems()) {
    item.normalize();
    const prefix = `${offset}${item.state} ${item.getKeyToPrint()}: {`;
    const subItems = item.subItems.map((subItem) => itemToString(subItem)).join('\n');
    const postfix = `${offset}  }`;
    return `${prefix}\n${subItems}\n${postfix}`;
  }
  if (item.hasValue()) {
    const valType = typeof item.value;
    if (valType === 'object' && item.value !== null) {
      const prefix = `${offset}${item.state} ${item.getKeyToPrint()}: {`;
      const postfix = `${offset}  }`;
      const newOffset = ' '.repeat((item.getKeyLevel() + 1) * 4 - 2);
      return `${prefix}\n${objectToString(newOffset, item.value).join('\n')}\n${postfix}`;
    }
    return `${offset}${item.state} ${item.getKeyToPrint()}: ${item.value}`;
  }
  if (!item.isCloseBracket()) {
    return `${offset}${item.state} ${item.getKeyToPrint()}: {`;
  }
  return `${offset}  }`;
};

const itemArrayToString = (itemArray) => {
  const body = itemArray.map((item) => itemToString(item)).join('\n');
  return `{\n${body}\n}`;
};

module.exports = itemArrayToString;
