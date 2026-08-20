import * as fs from "fs";
import * as path from "path";
import { describe, test, expect } from "vitest";

// The linter must never construct a survey model. This test pins its dependency
// closure: only the expression parser, the function registry, settings, and helpers.
const ALLOWED_EXTERNAL_MODULES = [
  "src/conditions/conditionsParser",
  // ValueGetter.getPath for reference-path parsing; its own runtime imports are
  // helpers and settings (IQuestion is type-only), so no model is pulled in
  "src/conditions/conditionProcessValue",
  "src/expressions/expressions",
  "src/expressions/expressionParser",
  "src/functionsfactory",
  "src/settings",
  "src/helpers",
];

const LINTER_DIR = path.resolve(__dirname, "../../src/linter");
const SRC_DIR = path.resolve(__dirname, "../../src");
const IMPORT_REGEX = /(?:import|export)\s[^"']*from\s*["']([^"']+)["']/g;

function collectFiles(dir: string): Array<string> {
  const res: Array<string> = [];
  fs.readdirSync(dir).forEach(entry => {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) res.push(...collectFiles(full));
    else if (entry.endsWith(".ts")) res.push(full);
  });
  return res;
}

describe("linter import allowlist", () => {
  test("src/linter imports only the allowed model-free modules", () => {
    const violations: Array<string> = [];
    collectFiles(LINTER_DIR).forEach(file => {
      const content = fs.readFileSync(file, "utf8");
      let match: RegExpExecArray;
      IMPORT_REGEX.lastIndex = 0;
      while((match = IMPORT_REGEX.exec(content)) !== null) {
        const specifier = match[1];
        if (!specifier.startsWith(".")) {
          violations.push(file + " imports a bare specifier: " + specifier);
          continue;
        }
        const resolved = path.resolve(path.dirname(file), specifier);
        if (resolved.startsWith(LINTER_DIR)) continue;
        const relative = path.relative(SRC_DIR, resolved).replace(/\\/g, "/");
        if (ALLOWED_EXTERNAL_MODULES.indexOf("src/" + relative) === -1) {
          violations.push(path.basename(file) + " imports src/" + relative +
            " which is outside the linter allowlist");
        }
      }
    });
    expect(violations).toEqual([]);
  });
});
