import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";

// Guards the defect this suite was written for: survey-core.css used to reference ~900
// `--sjs2-*` variables while defining none of them, because they were only ever
// delivered by a runtime <style> injection. Under a strict `style-src` CSP that
// injection is refused and the survey renders unstyled. The variables now ship inside
// the stylesheet, and this test keeps it that way.
const buildPath = path.resolve(__dirname, "../build");

// These are set per root element at runtime (see applyBoxShadowResetVars), so no
// stylesheet can define them.
const runtimeOnlyVariables = [
  "--sjs2-border-effect-surface-default-reset",
  "--sjs2-border-effect-surface-focused-reset",
  "--sjs2-border-effect-component-formbox-default-reset",
  "--sjs2-border-effect-component-formbox-focused-reset",
];

// Referenced by the css but absent from the design tokens in base-theme.ts. Pre-existing
// defects unrelated to CSP - listed so the test can catch new ones appearing.
const knownUndefinedVariables = [
  "--sjs2-color-bg-accent-primary",
  "--sjs2-color-bg-accent-secondary",
  "--sjs2-color-component-slider-readonly-thumb-border",
  "--sjs2-color-unknown-variable-001",
  "--sjs2-layout-component-page-box-gap-horizontal",
  "--sjs2-layout-component-panel-box-gap-horizontal",
  "--sjs2-layout-component-panel-content-area-padding-vertical",
  "--sjs2-layout-component-panel-dynamic-box-gap-horizontal",
  "--sjs2-layout-component-panel-simple-box-gap-horizontal",
  "--sjs2-layout-component-panel-simple-nested-box-gap-horizontal",
  "--sjs2-layout-control-action-xx-small-icon-horizontal",
  "--sjs2-layout-control-action-xx-small-icon-vertical",
  "--sjs2-radius-semantic-form-item",
  "--sjs2-size-icon-small",
  "--sjs2-spacing-x50",
];

function collect(css: string, regex: RegExp): Array<string> {
  const result: Array<string> = [];
  let match = regex.exec(css);
  while(match !== null) {
    result.push(match[1]);
    match = regex.exec(css);
  }
  return result;
}

function getUndefinedVariables(css: string): Array<string> {
  const defined = new Set(collect(css, /(?<![-\w])(--sjs2-[a-z0-9-]+)\s*:/g));
  const allowed = new Set([...runtimeOnlyVariables, ...knownUndefinedVariables]);
  const used = new Set(collect(css, /var\(\s*(--sjs2-[a-z0-9-]+)/g));
  return [...used].filter((name) => !defined.has(name) && !allowed.has(name)).sort();
}

describe("Shipped css defines the variables it uses", () => {
  const cssFiles = ["survey-core.css", "survey-core.min.css", "survey-core.fontless.css", "survey-core.fontless.min.css"];
  const isBuilt = fs.existsSync(path.resolve(buildPath, cssFiles[0]));
  // Without the flag an absent build folder skips the suite (the usual local case);
  // set REQUIRE_BUILT_CSS=true in CI so a missing build fails instead of hiding.
  const requireBuilt = process.env.REQUIRE_BUILT_CSS === "true";
  const skipWhenNotBuilt = !isBuilt && !requireBuilt;

  it.skipIf(!requireBuilt)("the build output is present (REQUIRE_BUILT_CSS)", () => {
    expect(isBuilt).toBeTruthy();
  });

  cssFiles.forEach((fileName) => {
    it.skipIf(skipWhenNotBuilt)(`${fileName} leaves no --sjs2 variable undefined`, () => {
      const css = fs.readFileSync(path.resolve(buildPath, fileName), "utf8");
      expect(getUndefinedVariables(css)).toEqual([]);
    });

    it.skipIf(skipWhenNotBuilt)(`${fileName} references no external font host and inlines no images`, () => {
      const css = fs.readFileSync(path.resolve(buildPath, fileName), "utf8");
      expect(css.indexOf("fonts.gstatic.com")).toBe(-1);
      expect(css.indexOf("fonts.googleapis.com")).toBe(-1);
      expect(css.indexOf("data:image/png")).toBe(-1);
      expect(css.indexOf("data:font")).toBe(-1);
    });

    // Guards the url-rewriting rules in rollup.helpers.mjs: an asset rewritten to a
    // relative path is only valid if the file is actually emitted into the build.
    it.skipIf(skipWhenNotBuilt)(`${fileName} references no relative url() asset that is not emitted next to it`, () => {
      const css = fs.readFileSync(path.resolve(buildPath, fileName), "utf8");
      const referenced = collect(css, /url\(\s*['"]?([^'")]+?)['"]?\s*\)/g)
        .filter((u) => !u.startsWith("data:") && !/^https?:/.test(u) && !u.startsWith("#"));
      referenced.forEach((assetPath) => {
        const filePath = assetPath.split(/[?#]/)[0];
        expect(fs.existsSync(path.resolve(buildPath, filePath)), `${fileName} -> ${assetPath}`).toBeTruthy();
      });
    });
  });

  it.skipIf(skipWhenNotBuilt)("the fonts referenced by the stylesheet are emitted next to it", () => {
    const css = fs.readFileSync(path.resolve(buildPath, "survey-core.css"), "utf8");
    const referenced = new Set(collect(css, /url\("?(fonts\/[^")]+)"?\)/g));
    expect(referenced.size).toBeGreaterThan(0);
    referenced.forEach((assetPath) => {
      expect(fs.existsSync(path.resolve(buildPath, assetPath))).toBeTruthy();
    });
  });
});
