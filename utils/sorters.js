const sortAsc = (a, b) => {
  if (a.key > b.key) {
    return 1;
  }
  if (a.key < b.key) {
    return -1;
  }
  return 0;
};

module.exports = {
  sortAsc,
};
