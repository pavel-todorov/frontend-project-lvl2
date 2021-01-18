var fs = require('fs');
var lodash = require('lodash');

const sortAsc = (a, b) => {
  if (a.key > b.key) {
    return 1;
  } else if (a.key < b.key) {
    return -1;
  }
  return 0;
};

module.exports = async function (path1, path2) { 
  class ResultItem {
    constructor(state, key, value)  {
      this.state = state;
      this.key = key;
      this.value = value;
    }

    toString() {
      return `  ${this.state} ${this.key}: ${this.value}`
    }
  }

  class ResultArray {
    data = new Map();

    push(item) {
      // console.log(`Result array: ${JSON.stringify(Array.from(this.data))}, add: ${item.toString()}, item.key: ${this.data.get(item.key)}`);
      if (this.data.get(item.key) === undefined) {
        this.data.set(item.key, []);
      }
      this.data.get(item.key).push(item);
    }

    toString() {
      const res = [];
      for (var value of this.data.values()) {
        value.forEach((item) => {
          res.push(item);
        });
      }
      return res
        .sort(sortAsc)
        .map((item) => item.toString()).join('\n');
    }
  }

  // console.log(`Source:\n${path1}\n${path2}`);
  try {
    const resultArray = new ResultArray();
    const readFilesResults = await Promise.all(
      [fs.promises.readFile(path1),
      fs.promises.readFile(path2)]);
    const [object1, object2] = readFilesResults.map((item) => JSON.parse(item));

    lodash.forIn(object1, (value, key) => {
      const obj2Value = lodash.get(object2, key);
      // console.log(`Object 1: ${key} -> ${value} (object2: ${obj2Value})`);
      if (value === obj2Value) {
        resultArray.push(new ResultItem(' ', key, value));
      } else if (obj2Value === undefined) {
        resultArray.push(new ResultItem('-', key, value));
      } else if (obj2Value != value) {
        resultArray.push(new ResultItem('-', key, value));
        resultArray.push(new ResultItem('+', key, obj2Value));
      }
    });
    lodash.forIn(object2, (value, key) => {
      const obj1Value = lodash.get(object1, key);
      // console.log(`Object 2: ${key} -> ${value} (object1: ${obj1Value})`);
      if (obj1Value === undefined) {
        resultArray.push(new ResultItem('+', key, value));
      }
    });
    return `{\n${resultArray.toString()}\n}`;
  }
  catch(err) {
    return err;
  }
};
