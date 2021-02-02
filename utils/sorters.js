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

module.exports = {
  sortAscByKey,
};
