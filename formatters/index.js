/* eslint-disable max-classes-per-file */
const stylishFormatter = require('./stylish.js');
const plainFormatter = require('./plain.js');
const jsonFomatter = require('./json.js');

const createFormatter = (type) => {
  if (type === 'stylish') {
    return class {
      static format(items) {
        return stylishFormatter(items);
      }
    };
  }
  if (type === 'plain') {
    return class {
      static format(items) {
        return plainFormatter(items);
      }
    };
  }
  if (type === 'json') {
    return class {
      static format(items) {
        return jsonFomatter(items);
      }
    };
  }
  return class {
    static format() {
      return JSON.stringify({ error: `Undefined formatter: '${type}'` });
    }
  };
};

module.exports = {
  createFormatter,
};
