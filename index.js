#!/usr/bin/env node
const { program } = require('commander');
const getDiff = require('./gendiff.js');

program
  .arguments('[filepath1] [filepath2]')
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1', '-V, --version', 'output the version number')
  .option('-h, --help', 'output usage information')
  .option('-f, --format [type]', 'output format')
  .action(async (file1, file2) => {
    const result = await getDiff(file1, file2);
    console.log(`Result:\n${result}`);
  });

program.parse(process.argv);

const options = program.opts();
if (options.help === true) {
  program.outputHelp();
}






