// Emits the base theme CSS variables as real CSS so that they ship inside
// survey-core.css. A stylesheet is not subject to the inline rules of a strict
// `style-src` Content-Security-Policy, while the runtime <style> injection is -
// see src/utils/base-theme-init.ts for the runtime counterpart (kept as a fallback).
//
// The variables reach the bundles through src/default-theme/base-theme-variables.generated.scss,
// which writeBaseThemeScss() rewrites on every build and default.fontless.scss @use-s.
// The file is committed so that a fresh checkout compiles without a build; csp_tests.ts
// asserts it stays in sync with base-theme.ts.
//
// The declaration-building logic mirrors buildBaseThemeCss() in
// src/utils/base-theme-init.ts; csp_tests.ts asserts they agree.

import fs from "fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const VARIABLES_PER_RULE = 300;
const THEME_ROOT_CLASS = "sd-theme-root";
export const BASE_THEME_SCSS_PATH = resolve(__dirname, "../src/default-theme/base-theme-variables.generated.scss");

const baseThemePath = resolve(__dirname, "../src/default-theme/base-theme.ts");

// base-theme.ts is an auto-generated module whose default export is a plain
// JSON-compatible object literal, so it is read rather than imported: importing it
// would require compiling TypeScript inside the build script.
function readBaseThemeVariables() {
  const source = fs.readFileSync(baseThemePath, "utf8");
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error(`Cannot locate the object literal in ${baseThemePath}`);
  }
  let theme;
  try {
    theme = JSON.parse(source.substring(start, end + 1));
  } catch(e) {
    throw new Error(`${baseThemePath} is no longer JSON-compatible, update build-base-theme-css.mjs: ${e.message}`);
  }
  const cssVariables = theme && theme.cssVariables;
  if (!cssVariables || Object.keys(cssVariables).length === 0) {
    throw new Error(`No cssVariables found in ${baseThemePath}`);
  }
  return cssVariables;
}

export function buildBaseThemeCss(cssVariables) {
  const names = Object.keys(cssVariables);
  const rules = [];
  for (let i = 0; i < names.length; i += VARIABLES_PER_RULE) {
    const declarations = names
      .slice(i, i + VARIABLES_PER_RULE)
      .map((name) => `  ${name}: ${cssVariables[name]};`)
      .join("\n");
    rules.push(`:where(.${THEME_ROOT_CLASS}) {\n${declarations}\n}`);
  }
  return rules.join("\n");
}

export function generateBaseThemeCss() {
  return buildBaseThemeCss(readBaseThemeVariables());
}

// Sass copies custom property values into the output verbatim (only #{} interpolation
// is evaluated), so values like `hsl(from var(--x) h s calc(l * 1.2))` survive as-is.
export function renderBaseThemeScss() {
  return "/* Auto-generated from src/default-theme/base-theme.ts by scripts/build-base-theme-css.mjs. Do not edit. */\n"
    + generateBaseThemeCss() + "\n";
}

// Skips the write when nothing changed, so a rollup watch session is not retriggered
// by its own config load.
export function writeBaseThemeScss() {
  const content = renderBaseThemeScss();
  if (fs.existsSync(BASE_THEME_SCSS_PATH) && fs.readFileSync(BASE_THEME_SCSS_PATH, "utf8") === content) return;
  fs.writeFileSync(BASE_THEME_SCSS_PATH, content);
}
