const getDiff = require('./gendiff');

const normalTestCaseWithSimpleDataExpectation = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

test('Test with json normal case', () => {
  expect(getDiff('./test_data/file1.json', './test_data/file2.json')).toBe(normalTestCaseWithSimpleDataExpectation);
});
