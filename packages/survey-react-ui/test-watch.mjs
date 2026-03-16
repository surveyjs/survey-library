/* global console, setTimeout, clearTimeout, process */
import { watch } from "rollup";
import { loadConfigFile } from "rollup/loadConfigFile";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { appendFileSync, writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const karma = require("karma");

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = resolve(__dirname, "rollup.tests.config.mjs");
const karmaConfigPath = resolve(__dirname, "karma.conf.js");
const logFile = resolve(__dirname, "tests/bundle/watch.log");

function log(msg) {
  const line = `[${new Date().toLocaleTimeString()}] ${msg}`;
  // eslint-disable-next-line no-console
  console.log(line);
  appendFileSync(logFile, line + "\n");
}

writeFileSync(logFile, "");
log("Starting rollup watcher...");

const { options } = await loadConfigFile(configPath);
const rollupConfig = options[0];

let karmaServerReady = false;
let buildReady = false;
let initialRunDone = false;
let runTimer = null;

function scheduleRun(reason) {
  if (runTimer) clearTimeout(runTimer);
  runTimer = setTimeout(() => {
    runTimer = null;
    log(`Running tests (${reason})...`);
    karma.runner.run({ port: 9876 }, (exitCode) => {
      log(`Tests finished (exit code ${exitCode})`);
    });
  }, 500);
}

function tryInitialRun() {
  if (!initialRunDone && karmaServerReady && buildReady) {
    initialRunDone = true;
    scheduleRun("initial");
  }
}

// Start karma server
const karmaConfig = await karma.config.parseConfig(karmaConfigPath, {
  singleRun: false,
  autoWatch: false,
}, { promiseConfig: true, throwErrors: true });

const karmaServer = new karma.Server(karmaConfig);

karmaServer.on("listening", () => {
  log("Karma server is listening");
});
karmaServer.on("browser_register", () => {
  log("Browser connected");
  karmaServerReady = true;
  tryInitialRun();
});

karmaServer.start();

// Start rollup watcher
const watcher = watch(rollupConfig);

watcher.on("event", (event) => {
  if (event.code === "BUNDLE_START") {
    log("Rollup rebuilding...");
  }
  if (event.code === "BUNDLE_END") {
    event.result.close();
    log(`Bundle ready in ${event.duration}ms`);
    buildReady = true;

    if (!initialRunDone) {
      tryInitialRun();
    } else {
      scheduleRun("rebuild");
    }
  }
  if (event.code === "ERROR") {
    log(`Build error: ${event.error.message}`);
  }
});

process.on("SIGINT", () => {
  watcher.close();
  karma.stopper.stop({ port: 9876 });
  process.exit(0);
});
