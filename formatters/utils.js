const isStateAdd = (item) => item.state === '+';
const isStateRemove = (item, nextItem) => item.state === '-' && nextItem !== undefined && item.key !== nextItem.key;
const isStateUpdate = (item, nextItem) => item.state === '-' && nextItem !== undefined && item.key === nextItem.key && nextItem.state === '+';
const getValuedItems = (itemArray) => itemArray.data.filter((item) => item.state !== '' && item.state !== ' ' && item.state !== '<');

module.exports = {
  isStateAdd,
  isStateRemove,
  isStateUpdate,
  getValuedItems,
};
