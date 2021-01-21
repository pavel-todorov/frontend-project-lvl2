const path = require('path');
const fs = require('fs');
const { getDiff } = require('./gendiff');

const getFixturePath = (fileName) => path.join(__dirname, '/__fixtures__', fileName);

const normalTestCaseWithSimpleDataExpectation = fs.readFileSync(getFixturePath('expectation.txt'), 'utf8');

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
