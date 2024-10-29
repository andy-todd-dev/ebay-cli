#!/usr/bin/env node

import { handleInit } from "./lib/init.js";
import { handleTransactions } from "./lib/transactions.js";
import { program } from "commander";
import Configstore from "configstore";

const config = new Configstore("ebay-cli");
const app = program.version("1.0.0", "-v, --version");

app
  .command("config")
  .alias("c")
  .action(() => console.log(`Config file located at: ${config.path}`));

app
  .command("init")
  .alias("i")
  .description("Get auth token to access eBay API")
  .argument("<clientId>", "eBay developer account client-id")
  .argument("<certificateId>", "eBay developer account certificate-id")
  .argument("<redirectUrlName>", "eBay developer account ruName")
  .action((clientId, certificateId, redirectUrlName) =>
    handleInit({ clientId, certificateId, redirectUrlName, config })
  );

app
  .command("transactions")
  .alias("tx")
  .description("Retrieve transaction data")
  .option("-f --date-from <string>", "Transactions from this date (ISO)")
  .option("-t --date-to <string>", "Transactions up until this date (ISO)")
  .option("-y --type <string>", "Transactions type")
  .option("-o --offset <number>", "Results offset")
  .option("-l --limit <number>", "Results limit")
  .option("-r --raw", "Output raw JSON from API")
  .option("-i --ids", "Display transaction IDs")
  .action((options) => handleTransactions({ ...options, config }));

app.parseAsync(process.argv);
