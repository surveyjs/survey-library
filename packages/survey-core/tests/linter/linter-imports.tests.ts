import * as fs from "fs";
import * as path from "path";
import { describe, test, expect } from "vitest";

// survey-core/linter is built with survey-core as an external dependency, so the
// linter's dependency closure is pinned here instead of by the bundler: the only
// non-relative import allowed is "survey-core" itself, because anything else (or a
// relative path out of src/linter) would compile a second copy of the core into the
// linter bundle, which is exactly what making it external removed. WHICH symbols
// come from survey-core is not restricted - it is external, so importing more of it
// costs nothing.
//
// What is restricted is building a model: issue #11693 requires that the analysis
// "does not construct or run a survey model" - the serializer normalizes the linted
// JSON (dropping unknown properties, replacing an unknown type), i.e. it swallows the
// very defects the linter looks for. The core's stateless utilities are NOT models and
// are meant to be reused: ConditionsParser, ValueGetter and TextPreProcessor own the
// parsing rules the linter would otherwise reimplement, so instantiating them is fine.
const FORBIDDEN_CONSTRUCTIONS = [
  "SurveyModel", "PageModel", "PanelModel", "Question", "ItemValue", "Trigger", "Serializer",
];
const MODEL_CTOR_REGEX = /\bnew\s+\w*(?:Model|Question|Panel|Page)\b/;

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

describe("linter dependency closure", () => {
  test("src/linter imports nothing but survey-core and its own files", () => {
    const violations: Array<string> = [];
    collectFiles(LINTER_DIR).forEach(file => {
      const content = fs.readFileSync(file, "utf8");
      const name = path.basename(file);
      let match: RegExpExecArray;
      IMPORT_REGEX.lastIndex = 0;
      while((match = IMPORT_REGEX.exec(content)) !== null) {
        const specifier = match[2];
        if (!specifier.startsWith(".")) {
          if (specifier !== "survey-core") {
            violations.push(name + " imports \"" + specifier + "\"; only \"survey-core\" is allowed");
          }
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
      const name = path.basename(file);
      if (MODEL_CTOR_REGEX.test(content)) {
        violations.push(name + " constructs a model object (" + MODEL_CTOR_REGEX.exec(content)[0] + ")");
      }
      FORBIDDEN_CONSTRUCTIONS.forEach(symbol => {
        const needle = "new " + symbol;
        let at = content.indexOf(needle);
        while(at > -1) {
          // reject only an exact constructor call, not a longer identifier
          const next = content[at + needle.length];
          if (next === "(" || next === " ") {
            violations.push(name + " constructs " + symbol);
            return;
          }
          at = content.indexOf(needle, at + 1);
        }
      });
    });
    expect(violations).toEqual([]);
  });
});
