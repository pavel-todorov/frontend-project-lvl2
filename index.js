#!/usr/bin/env node
const { program } = require('commander');
const genDiff = require('./gendiff.js');

program
  .allowUnknownOption()
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1', '-V, --version', 'output the version number')
  .helpOption('-h, --help', 'output usage information')
  .option('-f, --format [type]', 'output format', 'stylish')
  .option('--colors', 'just do nothing');

/* eslint no-console: 0 */
program
  .arguments('[filepath1] [filepath2]')
  .action((file1, file2) => {
    if (file1 === undefined || file2 === undefined) {
      program.outputHelp();
      return;
    }
    // console.log(`${file1}, ${file2}`);
    const result = genDiff(file1, file2, program.opts().format);
    console.log(result);
    // console.log(`Result:\n${result}`);
  });

program.parse(process.argv);

const options = program.opts();
if (options.help === true) {
  program.outputHelp();
}
