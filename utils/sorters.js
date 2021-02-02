/* eslint fp/no-mutation: ["off"] */
/* eslint fp/no-let: ["off"] */
const sortAscByKey = (a, b) => {
  if (a.key > b.key) {
    return 1;
  }
  if (a.key < b.key) {
    return -1;
  }
  return 0;
};

const sortAsc = (a, b) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
};

const sortKeyTypeObjectAsc = (a, b) => {
  const akey = `${a.key}${a.type}`;
  const bkey = `${b.key}${b.type}`;
  if (akey < bkey) {
    return -1;
  }
  if (akey > bkey) {
    return 1;
  }
  return 0;
};

const sortResultItemsAsc = (a, b) => {
  let ai = a.index;
  if (ai === undefined) {
    ai = '';
  }
  let bi = b.index;
  if (bi === undefined) {
    bi = '';
  }
  let at = a.state;
  if (at !== '<') {
    at = ' ';
  }
  let bt = b.state;
  if (bt !== '<') {
    bt = ' ';
  }
  const akey = `${a.key}${at}${ai}`;
  const bkey = `${b.key}${bt}${bi}`;
  if (akey < bkey) {
    return -1;
  }
  if (akey > bkey) {
    return 1;
  }
  return 0;
};

module.exports = {
  sortAsc,
  sortAscByKey,
  sortKeyTypeObjectAsc,
  sortResultItemsAsc,
};
