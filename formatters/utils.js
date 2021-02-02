/* eslint fp/no-mutating-methods: ["off"] */
/* eslint fp/no-mutation: ["off"] */
const isStateAdd = (item) => item.state === '+';

const isStateRemove = (item, nextItem) => item.state === '-' && nextItem !== undefined && item.key !== nextItem.key;

const isStateUpdate = (item, nextItem) => item.state === '-' && nextItem !== undefined && item.key === nextItem.key && nextItem.state === '+';

const getValuedSubItems = (item) => {
  if (!item.hasSubItems()) {
    return [];
  }
  const res = [];
  item.subItems.forEach((itm) => {
    if (itm.state === '+' || itm.state === '-') {
      res.push(itm);
    }
    res.push(...getValuedSubItems(itm));
  });
  return res;
};

const getValuedItems = (itemArray) => {
  const res = [];
  itemArray.forEach((item) => {
    item.normalize();
    if (item.state === '+' || item.state === '-') {
      res.push(item);
    }
    res.push(...getValuedSubItems(item));
  });
  return res;
};

module.exports = {
  isStateAdd,
  isStateRemove,
  isStateUpdate,
  getValuedItems,
};
