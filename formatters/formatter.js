const stylishFormatter = require('./stylish.js');

const createFormatter = (type) => {
  if (type === 'stylish') {
    return stylishFormatter;
  }
  return function format() {
    return JSON.stringify({ error: `Undefined formatter: '${type}'` });
  };
};

module.exports = {
  createFormatter,
};
