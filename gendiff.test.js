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

test('Test with yaml normal case', () => {
  expect(getDiff(getFixturePath('file1.yml'), getFixturePath('file2.yml'))).toBe(normalTestCaseWithSimpleDataExpectation);
});

test.each([
  ['file1.jso', 'file2.json'],
  ['file1.yml', 'file2.ym'],
])('Test with error files (%s, %s)', (a, b) => {
  expect(JSON.parse(getDiff(getFixturePath(a), getFixturePath(b)))).toEqual(
    expect.objectContaining({
      error: expect.any(String),
    }),
  );
});
