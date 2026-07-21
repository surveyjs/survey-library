/* eslint-env node */
/* eslint-disable no-console */
// Checks that the built CSS passes through a typical user PostCSS pipeline
// (postcss-import -> postcss-calc -> autoprefixer, as used by cssnano/CRA
// setups) without warnings. Added after #7454, where malformed calc()
// expressions in the shipped CSS broke users' builds.
//
// postcss-calc cannot parse two pieces of VALID modern CSS that the
// sjs2-fallbacks plugin bakes into the bundle, so warnings caused by them are
// expected and ignored:
//   1. Relative color syntax:            hsl(from var(--x, #fff) h s calc(l * 0.85))
//      -> "Lexical error ... l * 0.85"
//   2. calc() nested in a var() fallback: calc(100% - var(--x, calc(var(--y, 8px) * 4)))
//      -> "Parse error ... got unexpected RPAREN"
// In both cases postcss-calc leaves the declaration untouched (it only warns),
// so user pipelines keep working. Every other warning fails this check.
import { readFileSync } from "node:fs";
import postcss from "postcss";
import postcssImport from "postcss-import";
import postcssCalc from "postcss-calc";
import autoprefixer from "autoprefixer";

const cssPath = new URL("./build/survey-core.css", import.meta.url);

function isKnownBenignCalcWarning(warning) {
  if (warning.plugin !== "postcss-calc") return false;
  const value = (warning.node && warning.node.value) || "";
  // 1. calc() on a relative color channel, e.g. hsl(from ... calc(l * 0.85))
  if (/Lexical error/.test(warning.text) && /\bfrom\s+/.test(value)) return true;
  // 2. calc() nested inside a var() fallback
  if (/Parse error/.test(warning.text) && /var\(\s*--[\w-]+\s*,\s*calc\(/.test(value)) return true;
  return false;
}

const css = readFileSync(cssPath, "utf8");
const result = await postcss([postcssImport(), postcssCalc({}), autoprefixer()])
  .process(css, { from: cssPath.pathname, map: false });

const warnings = result.warnings();
const failures = warnings.filter((warning) => !isKnownBenignCalcWarning(warning));
const ignored = warnings.length - failures.length;
if (ignored > 0) {
  console.log(`test:postcss: ignored ${ignored} known postcss-calc warning(s) on valid modern CSS (relative colors / calc in var() fallbacks).`);
}
if (failures.length > 0) {
  console.error(`test:postcss: ${failures.length} warning(s) in build/survey-core.css:`);
  for (const warning of failures) {
    console.error(`\n[${warning.plugin}] ${warning.node ? `${warning.node.source?.start?.line}:${warning.node.source?.start?.column} (${warning.node.prop})` : ""}\n${warning.text}`);
  }
  process.exit(1);
}
console.log("test:postcss: OK");
