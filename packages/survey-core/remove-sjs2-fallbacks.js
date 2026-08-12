#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(path.join(__dirname, "src"));

/**
 * Walks a directory tree and yields all .scss file paths.
 */
function* walkScss(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkScss(full);
    } else if (entry.isFile() && entry.name.endsWith(".scss")) {
      yield full;
    }
  }
}

/**
 * Removes fallback values from all var(--sjs2-..., <fallback>) occurrences
 * in a CSS/SCSS string. Handles arbitrarily nested parentheses in fallbacks.
 *
 * @param {string} content
 * @returns {string}
 */
function removeFallbacks(content) {
  const PREFIX = "var(--sjs2-";
  let result = "";
  let i = 0;

  while(i < content.length) {
    if (content.startsWith(PREFIX, i)) {
      let j = i + PREFIX.length;
      let depth = 1;
      let firstCommaAtDepth1 = -1;

      while(j < content.length && depth > 0) {
        const ch = content[j];
        if (ch === "(") {
          depth++;
        } else if (ch === ")") {
          depth--;
          if (depth === 0) break; // j now points at the closing ')'
        } else if (ch === "," && depth === 1 && firstCommaAtDepth1 === -1) {
          firstCommaAtDepth1 = j;
        }
        j++;
      }

      if (firstCommaAtDepth1 !== -1 && depth === 0) {
        result += content.substring(i, firstCommaAtDepth1) + ")";
        i = j + 1; // advance past the closing ')'
      } else {
        result += content[i];
        i++;
      }
    } else {
      result += content[i];
      i++;
    }
  }

  return result;
}
let totalFiles = 0;
let changedFiles = 0;

for (const filePath of walkScss(rootDir)) {
  const original = fs.readFileSync(filePath, "utf8");
  const updated = removeFallbacks(original);

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, "utf8");
  }
}