const path = require('path');
const getDiff = require('./gendiff');

const normalTestCaseWithSimpleDataExpectation = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

const getFixturePath = (fileName) => path.join(__dirname, '/__fixtures__', fileName);

test('Test with json normal case', () => {
  expect(getDiff(getFixturePath('file1.json'), getFixturePath('file2.json'))).toBe(normalTestCaseWithSimpleDataExpectation);
});
