/* eslint-disable no-console */
// Generates <package>/tests/shards/markup.<N>.spec.ts (one shard per CPU core)
// so that vitest runs markup tests in parallel worker threads.
// Run from a UI package directory: node ../../tests/markup/gen-shards.js
// The generated directory is gitignored; it is recreated on every test run.
const fs = require("fs");
const path = require("path");
const os = require("os");

const shardsDir = path.resolve(process.cwd(), process.argv[2] || "tests/shards");
const shardCount = Math.max(1, os.cpus().length);

fs.rmSync(shardsDir, { recursive: true, force: true });
fs.mkdirSync(shardsDir, { recursive: true });
for (let shard = 1; shard <= shardCount; shard++) {
  fs.writeFileSync(
    path.join(shardsDir, `markup.${shard}.spec.ts`),
    `import { runMarkupTests } from "../markupRunner";\n\nrunMarkupTests(${shard}, ${shardCount});\n`,
    "utf-8"
  );
}
console.log(`Generated ${shardCount} markup test shards in ${shardsDir}`);
