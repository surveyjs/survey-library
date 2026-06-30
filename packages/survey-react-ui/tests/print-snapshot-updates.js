/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const logPath = path.resolve(__dirname, ".snapshot-updates.log");
let updated = [];
if (fs.existsSync(logPath)) {
  updated = fs.readFileSync(logPath, "utf-8").split(/\r?\n/).filter(Boolean);
  fs.unlinkSync(logPath);
}

console.log("");
updated.forEach((s) => console.log("Updated snapshot: " + s + ".snap.html"));
console.log("Total snapshots updated: " + updated.length);
