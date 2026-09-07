import * as fs from "fs";
import * as path from "path";
import { describe, test, expect } from "vitest";
import { allRules } from "../../src/linter/rules/index";

// rules/index.ts is a hand-maintained list: a rule file that is written but never added to
// allRules fails nothing at runtime - the rule silently does not run. The same drift applies
// to the README rules table, which is prose. Both are pinned here, in the style of
// linter-imports.tests.ts: read the sources, compare with the registry.
const RULES_DIR = path.resolve(__dirname, "../../src/linter/rules");
const README = path.resolve(__dirname, "../../src/linter/README.md");
const RULE_DECL_REGEX = /export const \w+: ILintRule = \{\s*id: "([^"]+)"/;

function collectRuleFiles(): Array<string> {
  return fs.readdirSync(RULES_DIR).filter(entry => entry.endsWith(".ts") && entry !== "index.ts");
}

describe("lint rule registry", () => {
  test("every rule file is registered in allRules exactly once", () => {
    const fromFiles: Array<string> = [];
    collectRuleFiles().forEach(file => {
      const content = fs.readFileSync(path.join(RULES_DIR, file), "utf8");
      const match = RULE_DECL_REGEX.exec(content);
      expect(match, file + " must declare a single ILintRule with a literal id as its first property").toBeTruthy();
      fromFiles.push(match[1]);
    });
    expect(allRules.map(rule => rule.id).sort()).toEqual(fromFiles.sort());
  });

  test("rule ids are unique and default severities are valid", () => {
    const seen = new Set<string>();
    allRules.forEach(rule => {
      expect(seen.has(rule.id), "duplicate rule id \"" + rule.id + "\"").toBe(false);
      seen.add(rule.id);
      expect(["error", "warning", "info"], rule.id + " has an invalid defaultSeverity").toContain(rule.defaultSeverity);
    });
  });

  test("every rule id is documented in the README rules table", () => {
    const readme = fs.readFileSync(README, "utf8");
    const missing = allRules
      .filter(rule => readme.indexOf("| `" + rule.id + "` |") === -1)
      .map(rule => rule.id);
    expect(missing).toEqual([]);
  });
});
