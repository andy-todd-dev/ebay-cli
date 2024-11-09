#!/usr/bin/env node

import {  handleAuthorise } from "../lib/authorise.js";
import { handleTransactions } from "../lib/transactions.js";
import { program } from "commander";
import Configstore from "configstore";
import chalk from 'chalk';

const config = new Configstore("ebay-cli");

const checkAuth = (cmd) => {
  if (!config.get("auth")) {
    console.error(chalk.red('Authentication required!'));
    console.error(chalk.yellow('Please run:'));
    console.error(chalk.cyan('ebay authorise <clientId> <certificateId> <redirectUrlName>'));
    process.exit(1);
  }
};

const app = program.version("0.1.0", "-v, --version");

// Commands that don't need auth
app
  .command("config")
  .alias("c")
  .action(() => console.log(`Config file located at: ${config.path}`));

app
  .command("authorise")
  .alias("auth")
  .description("Get auth token to access eBay API")
  .argument("<clientId>", "eBay developer account client-id")
  .argument("<certificateId>", "eBay developer account certificate-id")
  .argument("<redirectUrlName>", "eBay developer account ruName")
  .action((clientId, certificateId, redirectUrlName) =>
    handleAuthorise({ clientId, certificateId, redirectUrlName, config })
  );

// Commands that need auth
app
  .command("transactions")
  .alias("tx")
  .description("Retrieve transaction data")
  .hook('preAction', checkAuth)
  .option("-f --date-from <string>", "Transactions from this date (ISO)")
  .option("-t --date-to <string>", "Transactions up until this date (ISO)")
  .option("-y --type <string>", "Transactions type")
  .option("-o --offset <number>", "Results offset")
  .option("-l --limit <number>", "Results limit")
  .option("-r --raw", "Output raw JSON from API")
  .option("-i --ids", "Display transaction IDs")
  .action((options) => handleTransactions({ ...options, config }));

app.parseAsync(process.argv);
