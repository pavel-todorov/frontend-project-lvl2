/* eslint-disable max-classes-per-file */
/* eslint fp/no-mutation: ["off"] */
const stylishFormatter = require('./stylish.js');
const plainFormatter = require('./plain.js');
const jsonFormatter = require('./json.js');

const formatters = [['stylish', stylishFormatter], ['plain', plainFormatter], ['json', jsonFormatter]];

const createFormatter = (type) => {
  const formattersMap = new Map(formatters);
  if (formattersMap.has(type)) {
    return class {
      static format(items) {
        return formattersMap.get(type)(items);
      }
    };
  }
  return class {
    static format() {
      return JSON.stringify({ error: `Undefined formatter: '${type}'` });
    }
  };
};

module.exports = createFormatter;
