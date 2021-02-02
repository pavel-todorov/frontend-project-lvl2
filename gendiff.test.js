const path = require('path');
const fs = require('fs');
const genDiff = require('./gendiff');

const getFixturePath = (fileName) => path.join(__dirname, '/__fixtures__', fileName);

const expectationStylish = fs.readFileSync(getFixturePath('expectation_stylish.txt'), 'utf8');
const expectationPlain = fs.readFileSync(getFixturePath('expectation_plain.txt'), 'utf8');
const expectationJsonObject = JSON.parse(fs.readFileSync(getFixturePath('expectation_json.json'), 'utf8'));

test('Json normal case, default format', () => {
  expect(genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'))).toBe(expectationStylish);
});

test('Yaml normal case, stylish format', () => {
  expect(genDiff(getFixturePath('file1.yml'), getFixturePath('file2.yml'), 'stylish')).toBe(expectationStylish);
});

test('Json normal case, plain format', () => {
  expect(genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'), 'plain')).toBe(expectationPlain);
});

test('Yaml normal case, json format', () => {
  expect(JSON.parse(genDiff(getFixturePath('file1.yml'), getFixturePath('file2.yml'), 'json'))).toMatchObject(expectationJsonObject);
});

test.each([
  ['file1.jso', 'file2.json'],
  ['file1.yml', 'file2.ym'],
])('Error files case (%s, %s)', (a, b) => {
  expect(JSON.parse(genDiff(getFixturePath(a), getFixturePath(b)))).toEqual(
    expect.objectContaining({
      error: expect.any(String),
    }),
  );
});
