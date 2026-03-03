/* global console, setTimeout, clearTimeout, process */
import { watch } from "rollup";
import { loadConfigFile } from "rollup/loadConfigFile";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { appendFileSync, writeFileSync } from "node:fs";
import karma from "karma";

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = resolve(__dirname, "rollup.tests.config.mjs");
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

const karmaConfig = await karma.config.parseConfig(
  resolve(__dirname, "karma.conf.js"),
  { singleRun: false, autoWatch: true },
  { promiseConfig: true, throwErrors: true }
);

let karmaServer = null;

// Start rollup watcher
const rollupWatcher = watch(rollupConfig);

rollupWatcher.on("event", async (event) => {
  switch(event.code) {
    case "BUNDLE_START":
      log("Rollup rebuilding...");
      break;
    case "BUNDLE_END":
      log(`Bundle ready in ${event.duration}ms`);
      if (!karmaServer) {
        // First build completed, start Karma server
        karmaServer = new karma.Server(karmaConfig);
        karmaServer.start();
      }
      break;
    case "ERROR":
      log(`Build error: ${event.error.message}`);
      break;
  }
});

process.on("SIGINT", () => {
  rollupWatcher.close();
  if (karmaServer) {
    karmaServer.stop();
  }
  process.exit(0);
});
