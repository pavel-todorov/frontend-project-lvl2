const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const lodash = require('lodash');

const getObjectFromJSON = (file) => JSON.parse(fs.readFileSync(file));

const getObjectFromYaml = (file) => yaml.load(fs.readFileSync(file));

const getObject = (file) => {
  const extname = lodash.toLower(path.extname(file));
  if (extname === '.json') {
    return getObjectFromJSON(file);
  }
  if (extname === '.yaml' || extname === '.yml') {
    return getObjectFromYaml(file);
  }
  return undefined;
};

module.exports = {
  getObject,
};
