#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import viteDocsDev from './scripts/dev-docs';

const program = new Command();

const packageContent = fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8');
const packageData = JSON.parse(packageContent);

program.version(packageData.version).name('@ch-calender-cli').usage('command [options]');

program
  .command('docs-server')
  .description('document server')
  .action(async (args) => {
    viteDocsDev();
  });

program.parse();
