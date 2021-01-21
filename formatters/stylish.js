const itemToString = (item) => {
  const offset = ' '.repeat(item.getKeyLevel() * 4 - 2);
  if (item.hasValue()) {
    return `${offset}${item.state} ${item.getKeyToPrint()}: ${item.value}`;
  }
  if (!item.isCloseBracket()) {
    return `${offset}${item.state} ${item.getKeyToPrint()}: {`;
  }
  return `${offset}  }`;
};

const itemArrayToString = (itemArray) => {
  const body = itemArray.data.map((item) => itemToString(item)).join('\n');
  return `{\n${body}\n}`;
};

module.exports = itemArrayToString;
