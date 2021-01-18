const { sortAsc } = require('./utils/sorters');

class ResultItem {
  constructor(state, key, value) {
    this.state = state;
    this.key = key;
    this.value = value;
  }

  toString() {
    return `  ${this.state} ${this.key}: ${this.value}`;
  }
}

class ResultArray {
  constructor() {
    this.data = new Map();
  }

  push(item) {
    if (this.data.get(item.key) === undefined) {
      this.data.set(item.key, []);
    }
    this.data.get(item.key).push(item);
  }

  toString() {
    const res = [];
    this.data.forEach((value) => {
      value.forEach((item) => {
        res.push(item);
      });
    });
    return res
      .sort(sortAsc)
      .map((item) => item.toString()).join('\n');
  }
}

module.exports = {
  ResultItem,
  ResultArray,
};
