#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import viteDocsDev from './scripts/dev-docs';
import viteDocsBuild from './scripts/build-docs';
import viteCalenderDev from './scripts/dev-calender';
import viteCalenderBuild from './scripts/build-calender';

const program = new Command();

const packageContent = fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8');
const packageData = JSON.parse(packageContent);

program.version(packageData.version).name('@w-calender-cli').usage('command [options]');

program
  .command('docs-server')
  .description('docs server')
  .action(async (args) => {
    viteDocsDev();
  });
program
  .command('docs-build')
  .description('docs build production')
  .action(async (args) => {
    viteDocsBuild();
  });

program
  .command('calender-server')
  .description('lib server')
  .action(async (args) => {
    viteCalenderDev();
  });

program
  .command('calender-build')
  .description('lib build components')
  .action(async (args) => {
    viteCalenderBuild();
  });

program.parse();
