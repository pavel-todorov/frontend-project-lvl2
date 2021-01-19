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

test('Test with json error open file', () => {
  expect(JSON.parse(getDiff(getFixturePath('file1.jso'), getFixturePath('file2.json')))).toEqual(
    expect.objectContaining({
      error: expect.any(String),
    }),
  );
});

test('Test with yaml normal case', () => {
  expect(getDiff(getFixturePath('file1.yml'), getFixturePath('file2.yml'))).toBe(normalTestCaseWithSimpleDataExpectation);
});

test('Test with yaml error open file', () => {
  expect(JSON.parse(getDiff(getFixturePath('file1.yml'), getFixturePath('file2.ym')))).toEqual(
    expect.objectContaining({
      error: expect.any(String),
    }),
  );
});
