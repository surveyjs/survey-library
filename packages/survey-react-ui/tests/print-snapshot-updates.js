/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

// Each markup test shard writes its own .snapshot-updates.<N>.log (see markupRunner.ts).
const logFiles = fs.readdirSync(__dirname).filter((f) => /^\.snapshot-updates(\.\d+)?\.log$/.test(f));
let updated = [];
logFiles.forEach((f) => {
  const logPath = path.resolve(__dirname, f);
  updated = updated.concat(fs.readFileSync(logPath, "utf-8").split(/\r?\n/).filter(Boolean));
  fs.unlinkSync(logPath);
});
updated.sort();

console.log("");
updated.forEach((s) => console.log("Updated snapshot: " + s + ".snap.html"));
console.log("Total snapshots updated: " + updated.length);
