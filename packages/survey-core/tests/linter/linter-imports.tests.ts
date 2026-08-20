import * as fs from "fs";
import * as path from "path";
import { describe, test, expect } from "vitest";

// survey-core/linter is built with survey-core as an external dependency, so the
// linter's dependency closure is pinned here instead of by the bundler:
//
// - the only non-relative import allowed is "survey-core" itself: anything else
//   (a relative path into src/) would compile a second copy of the core into the
//   linter bundle, which is exactly what making it external removed;
// - only these symbols may come from it. Issue #11693 requires that the analysis
//   "does not construct or run a survey model" - the serializer normalizes the
//   linted JSON (dropping unknown properties, replacing an unknown type), i.e. it
//   swallows the very defects the linter looks for. Trigger is allowed for its
//   static Trigger.operators only; constructing one is not.
const ALLOWED_CORE_SYMBOLS = [
  "ConditionsParser",
  "Operand", "Const", "BinaryOperand", "Variable", "FunctionOperand", "ArrayOperand", "UnaryOperand",
  "ValueGetter",
  "settings",
  "Helpers",
  "FunctionFactory",
  "Trigger",
];

const LINTER_DIR = path.resolve(__dirname, "../../src/linter");
const IMPORT_REGEX = /(?:import|export)\s+([^"']*?)\s*from\s*["']([^"']+)["']/g;

function collectFiles(dir: string): Array<string> {
  const res: Array<string> = [];
  fs.readdirSync(dir).forEach(entry => {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) res.push(...collectFiles(full));
    else if (entry.endsWith(".ts")) res.push(full);
  });
  return res;
}

function importedSymbols(clause: string): Array<string> {
  const braces = clause.match(/\{([^}]*)\}/);
  if (!braces) return [];
  return braces[1].split(",")
    .map(part => part.trim())
    // "X as Y" - the imported name is what matters
    .map(part => part.split(/\s+as\s+/)[0].trim())
    .filter(part => !!part);
}

describe("linter dependency closure", () => {
  test("src/linter imports nothing but the allowed survey-core symbols", () => {
    const violations: Array<string> = [];
    collectFiles(LINTER_DIR).forEach(file => {
      const content = fs.readFileSync(file, "utf8");
      const name = path.basename(file);
      let match: RegExpExecArray;
      IMPORT_REGEX.lastIndex = 0;
      while((match = IMPORT_REGEX.exec(content)) !== null) {
        const clause = match[1];
        const specifier = match[2];
        if (!specifier.startsWith(".")) {
          if (specifier !== "survey-core") {
            violations.push(name + " imports \"" + specifier + "\"; only \"survey-core\" is allowed");
            continue;
          }
          importedSymbols(clause).forEach(symbol => {
            if (ALLOWED_CORE_SYMBOLS.indexOf(symbol) === -1) {
              violations.push(name + " imports \"" + symbol + "\" from survey-core, " +
                "which is not in ALLOWED_CORE_SYMBOLS");
            }
          });
          continue;
        }
        const resolved = path.resolve(path.dirname(file), specifier);
        if (!resolved.startsWith(LINTER_DIR)) {
          violations.push(name + " imports \"" + specifier + "\", which leaves src/linter; " +
            "import it from \"survey-core\" instead");
        }
      }
    });
    expect(violations).toEqual([]);
  });

  test("the linter never constructs a model object", () => {
    const violations: Array<string> = [];
    collectFiles(LINTER_DIR).forEach(file => {
      const content = fs.readFileSync(file, "utf8");
      ALLOWED_CORE_SYMBOLS.forEach(symbol => {
        // the two stateless parsers are not model objects
        if (symbol === "ValueGetter" || symbol === "ConditionsParser") return;
        const needle = "new " + symbol;
        let at = content.indexOf(needle);
        while(at > -1) {
          // reject only an exact constructor call, not a longer identifier
          const next = content[at + needle.length];
          if (next === "(" || next === " ") {
            violations.push(path.basename(file) + " constructs " + symbol);
            return;
          }
          at = content.indexOf(needle, at + 1);
        }
      });
    });
    expect(violations).toEqual([]);
  });
});
