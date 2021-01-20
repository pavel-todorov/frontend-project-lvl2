const lodash = require('lodash');
const { sortAsc } = require('./utils/sorters');

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

  toString() {
    const offset = ' '.repeat(this.getKeyLevel() * 4 - 2);
    if (this.hasValue()) {
      return `${offset}${this.state} ${this.getKeyToPrint()}: ${this.value}`;
    }
    if (this.state !== '') {
      return `${offset}${this.state} ${this.getKeyToPrint()}: {`;
    }
    return `${offset}  }`;
  }
}

const addCloseBrackets = (sorted) => {
  let currentOpenKey = '';
  let currentStatusIsPlus = false;
  const currentPropertiesArray = [];
  const withAddedCloseElements = [];
  const checkItem = (item) => {
    if (currentOpenKey !== '' && !lodash.startsWith(item.key, currentOpenKey)) {
      withAddedCloseElements.push(new ResultItem('', currentOpenKey));
      currentPropertiesArray.pop();
      console.log(`< CurrentPropertiesArray ('${currentOpenKey}', '${item.key}'): ${JSON.stringify(currentPropertiesArray)}`);
      if (currentPropertiesArray.length > 0) {
        currentOpenKey = lodash.last(currentPropertiesArray).currentOpenKey;
        currentStatusIsPlus = lodash.last(currentPropertiesArray).currentStatusIsPlus;
      } else {
        currentOpenKey = '';
        currentStatusIsPlus = false;
      }
    }
  };
  sorted.forEach((item) => {
    checkItem(item);
    if (currentStatusIsPlus) {
      withAddedCloseElements.push(new ResultItem(' ', item.key, item.value));
    } else {
      withAddedCloseElements.push(item);
    }
    if (!item.hasValue()) {
      checkItem(item);
      currentOpenKey = item.key;
      currentStatusIsPlus = item.state === '+';
      currentPropertiesArray.push({ currentOpenKey, currentStatusIsPlus });
      console.log(`> CurrentPropertiesArray ('${currentOpenKey}', '${item.key}'): ${JSON.stringify(currentPropertiesArray)}`);
    }
  });
  return withAddedCloseElements;
};

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

  pushAll(items) {
    items.forEach((item) => this.push(item));
  }

  toString() {
    const res = [];
    this.data.forEach((value) => {
      value.forEach((item) => {
        res.push(item);
      });
    });
    const sorted = res.sort(sortAsc);
    const withAddedCloseElements = addCloseBrackets(sorted);
    const toReturn = withAddedCloseElements.map((item) => item.toString()).join('\n');
    console.log(`ResultArray:\n${toReturn}`);
    return toReturn;
  }
}

module.exports = {
  ResultItem,
  ResultArray,
};
