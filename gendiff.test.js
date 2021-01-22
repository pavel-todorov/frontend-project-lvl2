const path = require('path');
const fs = require('fs');
const { getDiff } = require('./gendiff');

const getFixturePath = (fileName) => path.join(__dirname, '/__fixtures__', fileName);

const expectationStylish = fs.readFileSync(getFixturePath('expectation_stylish.txt'), 'utf8');
const expectationPlain = fs.readFileSync(getFixturePath('expectation_plain.txt'), 'utf8');
const expectationJsonObject = JSON.parse(fs.readFileSync(getFixturePath('expectation_json.json'), 'utf8'));

test('Test with json normal case, default format', () => {
  expect(getDiff(getFixturePath('file1.json'), getFixturePath('file2.json'))).toBe(expectationStylish);
});

test('Test with yaml normal case, stylish format', () => {
  expect(getDiff(getFixturePath('file1.yml'), getFixturePath('file2.yml'), 'stylish')).toBe(expectationStylish);
});

test('Test with json normal case, plain format', () => {
  expect(getDiff(getFixturePath('file1.json'), getFixturePath('file2.json'), 'plain')).toBe(expectationPlain);
});

test('Test with yaml normal case, json format', () => {
  expect(JSON.parse(getDiff(getFixturePath('file1.yml'), getFixturePath('file2.yml'), 'json'))).toMatchObject(expectationJsonObject);
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
