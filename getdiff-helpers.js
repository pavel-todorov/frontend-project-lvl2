const lodash = require('lodash');

class ResultItem {
  constructor(state, key, value = undefined) {
    this.state = state;
    this.key = key;
    this.value = value;
  }

  getKeyLevel() {
    return this.key.split('.').length;
  }

  hasValue() {
    return this.value !== undefined;
  }

  getKeyToPrint() {
    return lodash.last(this.key.split('.'));
  }

  isCloseBracket() {
    return this.state === '<';
  }

  toString() {
    const offset = ' '.repeat(this.getKeyLevel() * 4 - 2);
    if (this.hasValue()) {
      return `${offset}${this.state} ${this.getKeyToPrint()}: ${this.value}`;
    }
    if (!this.isCloseBracket()) {
      return `${offset}${this.state} ${this.getKeyToPrint()}: {`;
    }
    return `${offset}  }`;
  }
}

class ResultArray {
  constructor() {
    this.data = [];
  }

  push(item) {
    this.data.push(item);
  }

  pushAll(items) {
    items.forEach((item) => this.push(item));
  }

  insertAfterClosedKey(key, item) {
    const index = this.data.findIndex((value) => (value.key === `${key}<<<<<` && value.isCloseBracket()));
    // console.log(`InsertAfterClosedKey(${key}, ${item}): index: ${index}`);
    if (index >= 0) {
      this.data.splice(index + 1, 0, item);
    }
  }

  toString() {
    return this.data.map((item) => item.toString()).join('\n');
  }
}

module.exports = {
  ResultItem,
  ResultArray,
};
