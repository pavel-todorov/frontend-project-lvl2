const path = require('path');
const fs = require('fs');
const { getDiff, compareForward, compareBackward } = require('./gendiff');

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

test('CompareForward normal case simple mode, no path', () => {
  expect(
    compareForward({ a: 'a1', b: 'b1', c: 'c1' }, { a: 'a2', b: 'b1' })
      .map((item) => item.toString()),
  ).toEqual(expect.arrayContaining([
    '  - a: a1',
    '  + a: a2',
    '    b: b1',
    '  - c: c1']));
});

test('CompareForward normal case difficult mode, no path', () => {
  expect(
    compareForward({ a: 'a1', b: { b1: 'b1.1' }, c: { c1: 'c1.1' } }, { a: 'a2', b: { b1: 'b1.2' } })
      .map((item) => item.toString()),
  ).toEqual(expect.arrayContaining([
    '  - a: a1',
    '  + a: a2',
    '    b: {',
    '      - b1: b1.1',
    '      + b1: b1.2',
    '  - c: {',
    '      - c1: c1.1']));
});

test('CompareBackward normal case simple mode, no path', () => {
  expect(
    compareBackward({ a: 'a1', b: 'b1', c: 'c1' }, { a: 'a2', b: 'b1', d: 'd2' })
      .map((item) => item.toString()),
  ).toEqual(expect.arrayContaining(['  + d: d2']));
});

test('CompareBackward normal case difficult mode, no path', () => {
  expect(
    compareBackward({ a: 'a1', b: 'b1', c: 'c1' }, { a: 'a2', b: 'b1', d: { d2: 'd2.2' } })
      .map((item) => item.toString()),
  ).toEqual(expect.arrayContaining([
    '  + d: {',
    '      + d2: d2.2',
  ]));
});
