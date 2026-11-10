import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as sass from "sass";
import * as postcss from "postcss";

// Sass and postcss 8 accept almost anything as a custom property value, so a missing ";"
// after `--a: 0` silently swallows the next `--b: ...` declaration into the value of --a.
// Stricter tools (postcss 7, used by cssnano@4 / css-minimizer-webpack-plugin@1) reject the
// shipped stylesheet with "Missed semicolon". Compiling the sources keeps this check
// independent of the build folder.
const srcPath = path.resolve(__dirname, "../src");
const adaptersPath = path.resolve(srcPath, "themes/adapters");

const entries = [
  "default-theme/default.scss",
  "default-theme/collaboration.scss",
  ...fs.readdirSync(adaptersPath)
    .filter((name) => name.endsWith(".scss"))
    .map((name) => "themes/adapters/" + name),
];

function getMergedDeclarations(css: string): Array<string> {
  const result: Array<string> = [];
  postcss.parse(css).walkDecls((decl) => {
    if (/(^|\s)--[\w-]+\s*:/.test(decl.value)) {
      const selector = (decl.parent as postcss.Rule).selector || "";
      result.push(`${selector.replace(/\s+/g, " ")} { ${decl.prop}: ${decl.value.replace(/\s+/g, " ")} }`);
    }
  });
  return result;
}

describe("Compiled scss has no declarations merged by a missing semicolon", () => {
  entries.forEach((entry) => {
    it(`Bug#12273 ${entry}`, () => {
      const css = sass.compile(path.resolve(srcPath, entry), { logger: sass.Logger.silent }).css;
      expect(getMergedDeclarations(css)).toEqual([]);
    });
  });
});
