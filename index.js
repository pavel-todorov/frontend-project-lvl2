#!/usr/bin/env node
const { program } = require('commander');

program
  .version('0.0.1', '-V, --version', 'output the version number')
  .option('-h, --help', 'output usage information')
  .parse(process.argv);

const options = program.opts();
if (options.help === true) {
  program.outputHelp();
}
