#!/usr/bin/env node
const { program } = require('commander');

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1', '-V, --version', 'output the version number')
  .arguments('<filepath1> <filepath2>')
  .option('-h, --help', 'output usage information')
  .option('-f, --format [type]', 'output format')
  .parse(process.argv);

const options = program.opts();
if (options.help === true) {
  program.outputHelp();
}
