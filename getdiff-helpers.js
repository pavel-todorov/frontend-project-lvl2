/* eslint-disable max-classes-per-file */
/* eslint fp/no-mutation: ["off"] */
/* eslint fp/no-class: ["off"] */
/* eslint fp/no-this: ["off"] */
const lodash = require('lodash');
const { sortAscByKey } = require('./utils/sorters');

class ResultItem {
  constructor(state, key, value = undefined) {
    this.state = state;
    this.key = key;
    this.value = value;
    this.subItems = [];
  }

  addSubItem(item) {
    this.subItems.push(item);
  }

  addSubItems(items) {
    if (items.length > 0) {
      this.subItems.push(...items);
    }
  }

  getKeyLevel() {
    return this.key.split('.').length;
  }

  hasValue() {
    return this.value !== undefined;
  }

  hasSubItems() {
    return this.subItems.length > 0;
  }

  getKeyToPrint() {
    return lodash.last(this.key.split('.'));
  }

  isCloseBracket() {
    return this.state === '<';
  }

  normalize() {
    if (!this.hasSubItems()) {
      return;
    }
    this.subItems.sort(sortAscByKey);
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

  insertAfter(key, item) {
    const index = this.data.findIndex((value) => (value.key === `${key}` && value.isCloseBracket()));
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
