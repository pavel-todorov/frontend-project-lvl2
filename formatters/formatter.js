const stylishFormatter = require('./stylish.js');

const createFormatter = (type) => {
  if (type === 'stylish') {
    return class {
      static format(items) {
        return stylishFormatter(items);
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
