const path = require('path');
const fs = require('fs');
const genDiff = require('./gendiff');
const _ = require('lodash');

const getFixturePath = (fileName) => path.join(__dirname, '/__fixtures__', fileName);

const expectationStylish = fs.readFileSync(getFixturePath('expectation_stylish.txt'), 'utf8');
const expectationPlain = fs.readFileSync(getFixturePath('expectation_plain.txt'), 'utf8');
const expectationJsonObject = JSON.parse(fs.readFileSync(getFixturePath('expectation_json.json'), 'utf8'));

test('Test with json normal case, default format', () => {
  expect(genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'))).toBe(expectationStylish);
});

test('Test with yaml normal case, stylish format', () => {
  expect(genDiff(getFixturePath('file1.yml'), getFixturePath('file2.yml'), 'stylish')).toBe(expectationStylish);
});

test('Test with json normal case, plain format', () => {
  expect(genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'), 'plain')).toBe(expectationPlain);
});

test('Test with yaml normal case, json format', () => {
  expect(JSON.parse(genDiff(getFixturePath('file1.yml'), getFixturePath('file2.yml'), 'json'))).toMatchObject(expectationJsonObject);
});

test.each([
  ['file1.jso', 'file2.json'],
  ['file1.yml', 'file2.ym'],
])('Test with error files (%s, %s)', (a, b) => {
  expect(JSON.parse(genDiff(getFixturePath(a), getFixturePath(b)))).toEqual(
    expect.objectContaining({
      error: expect.any(String),
    }),
  );
});

// Array1: [
//   "common",
//   "common.setting1",
//   "common.setting2",
//   "common.setting3",
//   "common.setting6",
//   "common.setting6.key",
//   "common.setting6.doge",
//   "common.setting6.doge.wow",
//   "common.setting6.doge<<<<<",
//   "common.setting6<<<<<",
//   "common<<<<<",
//   "group1",
//   "group1.baz",
//   "group1.foo",
//   "group1.nest",
//   "group1.nest.key",
//   "group1.nest<<<<<",
//   "group1<<<<<",
//   "group2",
//   "group2.abc",
//   "group2.deep",
//   "group2.deep.id",
//   "group2.deep<<<<<",
//   "group2<<<<<"]

//   Array2: [
//     "common",
//     "common.follow",
//     "common.setting1",
//     "common.setting3",
//     "common.setting4",
//     "common.setting5",
//     "common.setting5.key5",
//     "common.setting5<<<<<",
//     "common.setting6",
//     "common.setting6.key",
//     "common.setting6.ops",
//     "common.setting6.doge",
//     "common.setting6.doge.wow",
//     "common.setting6.doge<<<<<",
//     "common.setting6<<<<<",
//     "common<<<<<","group1",
//     "group1.foo",
//     "group1.baz",
//     "group1.nest",
//     "group1<<<<<",
//     "group3",
//     "group3.fee",
//     "group3.deep",
//     "group3.deep.id",
//     "group3.deep.id.number",
//     "group3.deep.id<<<<<",
//     "group3.deep<<<<<",
//     "group3<<<<<"]

//     Union: [
//       "common",
//       "common.setting1",
//       "common.setting2",
//       "common.setting3",
//       "common.setting6",
//       "common.setting6.key",
//       "common.setting6.doge",
//       "common.setting6.doge.wow",
//       "common.setting6.doge<<<<<",
//       "common.setting6<<<<<",
//       "common<<<<<","group1",
//       "group1.baz","group1.foo",
//       "group1.nest",
//       "group1.nest.key",
//       "group1.nest<<<<<",
//       "group1<<<<<","group2",
//       "group2.abc",
//       "group2.deep",
//       "group2.deep.id",
//       "group2.deep<<<<<",
//       "group2<<<<<",
//       "common.follow",
//       "common.setting4",
//       "common.setting5",
//       "common.setting5.key5",
//       "common.setting5<<<<<",
//       "common.setting6.ops",
//       "group3","group3.fee",
//       "group3.deep",
//       "group3.deep.id",
//       "group3.deep.id.number",
//       "group3.deep.id<<<<<",
//       "group3.deep<<<<<",
//       "group3<<<<<"]

// test('Union', () => {
//   expect(_.union(['a', 'b', 'c'], ['d', 'b', 'e'])).toEqual(
//     expect.arrayContaining(['a', 'b', 'c', 'd', 'e']),
//   );
// });

// test('Union', () => {
//   const res = _.unionWith(
//     [{ key: 'a', index: 0, type: '<' }, { key: 'b', index: 1, type: '' }, { key: 'c', index: 2, type: '' }],
//     [{ key: 'd', index: 0, type: '' }, { key: 'b', index: 2, type: '<' }, { key: 'e', index: 1, type: '' }],
//     (a, b) => a.key === b.key && a.type === b.type,
//   );
//   console.log(JSON.stringify(res));
//   expect(res).toEqual(
//     expect.arrayContaining([{ key: 'a' }, { key: 'b' }, { key: 'c' }, { key: 'd' }, { key: 'e' }]),
//   );
// });
