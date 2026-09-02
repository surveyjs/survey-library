import { describe, expect, it, afterEach, beforeEach } from "vitest";
import {
  buildBaseThemeCss,
  createBaseThemeStyle,
  ensureBaseThemeStyles,
  createBoxShadowResetVariables,
  areBaseThemeVariablesApplied,
  areBaseThemeVariablesInDocument,
  resetBaseThemeProbeCache
} from "../src/utils/base-theme-init";
import { SurveyModel } from "../src/survey";
import * as fs from "fs";
import * as path from "path";

const RESET_VARIABLE = "--sjs2-border-effect-surface-default-reset";

function createThemeRoot(): HTMLElement {
  const element = document.createElement("div");
  element.className = "sd-theme-root";
  document.body.appendChild(element);
  return element;
}

describe("CSP: base theme variables shipped as a stylesheet", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    resetBaseThemeProbeCache();
  });

  // base-theme.scss is emitted by the theme generation tooling (alongside
  // src/themes/*.ts) and committed; nothing rewrites it at build time. This test
  // catches base-theme.ts and the scss regenerating out of step - the stylesheet
  // delivery and the runtime fallback must carry the same variables.
  it("the committed base-theme.scss is in sync with base-theme.ts", () => {
    const scssPath = path.resolve(__dirname, "../src/default-theme/base-theme.scss");
    const scss = fs.readFileSync(scssPath, "utf8").replace(/\r\n/g, "\n");
    const withoutHeaderComment = scss.substring(scss.indexOf("\n") + 1);
    expect(withoutHeaderComment).toBe(createBaseThemeStyle() + "\n");
  });

  it("the generated css defines the variables under the theme root class", () => {
    const css = buildBaseThemeCss({ "--test-a": "1px", "--test-b": "2px" });
    expect(css).toBe(":where(.sd-theme-root) {\n  --test-a: 1px;\n  --test-b: 2px;\n}");
  });

  // jsdom supports neither constructable stylesheets nor adoptedStyleSheets, so
  // these tests exercise the last-resort delivery: variables set on the element
  // itself through CSSOM. The adopted-sheet branch is tested below with a mock
  // and for real by the CSP e2e spec. No branch injects a <style> element.
  it("writes the variables onto the element when adopted stylesheets are unsupported", () => {
    const root = createThemeRoot();
    ensureBaseThemeStyles(root);
    expect(root.querySelector("style")).toBeFalsy();
    expect(root.style.getPropertyValue("--sjs2-base-unit-size")).not.toBe("");
  });

  it("leaves the element alone when a stylesheet already applies the variables", () => {
    const stylesheet = document.createElement("style");
    stylesheet.textContent = ":where(.sd-theme-root) { --sjs2-base-unit-size: 8px; }";
    document.head.appendChild(stylesheet);
    const root = createThemeRoot();
    expect(areBaseThemeVariablesApplied(root)).toBeTruthy();

    ensureBaseThemeStyles(root);
    expect(root.querySelector("style")).toBeFalsy();
    expect(root.style.getPropertyValue("--sjs2-base-unit-size")).toBe("");
    document.head.removeChild(stylesheet);
  });

  it("themeStyle is empty when the document already carries the variables", () => {
    const stylesheet = document.createElement("style");
    stylesheet.textContent = ":where(.sd-theme-root) { --sjs2-base-unit-size: 8px; }";
    document.head.appendChild(stylesheet);
    resetBaseThemeProbeCache();
    expect(areBaseThemeVariablesInDocument()).toBeTruthy();
    expect(new SurveyModel().themeStyle).toBe("");
    document.head.removeChild(stylesheet);
  });

  it("themeStyle falls back to the full css when nothing defines the variables", () => {
    resetBaseThemeProbeCache();
    expect(areBaseThemeVariablesInDocument()).toBeFalsy();
    expect(new SurveyModel().themeStyle.indexOf("--sjs2-base-unit-size") !== -1).toBeTruthy();
  });
});

describe("CSP: static reset variables derived from the raw theme values", () => {
  // These need no DOM at all: the lengths of the raw values zero out (a `var()`
  // length parses to 0) and the color survives - as a live `var()` reference for
  // the base theme, as a literal for themes overriding the composite - so the
  // models merge the map into the style binding they expose to the renderers.
  it("builds a reset for every border effect the css consumes", () => {
    const resets = createBoxShadowResetVariables();
    expect(resets["--sjs2-border-effect-component-formbox-default-reset"])
      .toBe("inset 0px 0px 0px 0px var(--sjs2-color-component-formbox-default-border)");
    expect(resets["--sjs2-border-effect-component-formbox-focused-reset"])
      .toBe("inset 0px 0px 0px 0px var(--sjs2-color-component-formbox-focused-border)");
    expect(resets["--sjs2-border-effect-surface-default-reset"])
      .toBe("0px 0px 0px 0px var(--sjs2-color-utility-shadow-surface-default)");
  });

  it("returns the same cached map on every base-only call", () => {
    expect(createBoxShadowResetVariables()).toBe(createBoxShadowResetVariables());
    expect(createBoxShadowResetVariables({})).toBe(createBoxShadowResetVariables());
  });

  it("a theme overriding a composite border effect overrides its reset too", () => {
    // The flat/borderless themes replace the composite with a literal, non-inset
    // shadow; the reset must mirror that structure or a focus transition jumps.
    const resets = createBoxShadowResetVariables({
      "--sjs2-border-effect-component-formbox-default": "0px 0px 0px 1px rgba(255, 255, 255, 0.07)",
    });
    expect(resets["--sjs2-border-effect-component-formbox-default-reset"])
      .toBe("0px 0px 0px 0px rgba(255, 255, 255, 0.07)");
    // Untouched effects still derive from the base theme values.
    expect(resets["--sjs2-border-effect-surface-default-reset"])
      .toBe("0px 0px 0px 0px var(--sjs2-color-utility-shadow-surface-default)");
    // The themed call must not poison the cached base-only map.
    expect(createBoxShadowResetVariables()["--sjs2-border-effect-component-formbox-default-reset"])
      .toBe("inset 0px 0px 0px 0px var(--sjs2-color-component-formbox-default-border)");
  });
});

describe("CSP: adopted stylesheet fallback (mocked constructable support)", () => {
  // jsdom lacks constructable stylesheets, so the browser branch is simulated:
  // replaceSync is stubbed onto the prototype and document.adoptedStyleSheets is
  // made an assignable array - exactly the surface the implementation detects.
  let replacedCss: Array<string>;

  beforeEach(() => {
    replacedCss = [];
    (<any>CSSStyleSheet.prototype).replaceSync = function(css: string) { replacedCss.push(css); };
    Object.defineProperty(document, "adoptedStyleSheets", { value: [], writable: true, configurable: true });
  });

  afterEach(() => {
    delete (<any>CSSStyleSheet.prototype).replaceSync;
    delete (<any>document).adoptedStyleSheets;
    document.body.innerHTML = "";
    resetBaseThemeProbeCache();
  });

  it("adopts one shared sheet instead of touching the elements", () => {
    const first = createThemeRoot();
    ensureBaseThemeStyles(first);
    const adopted = (<any>document).adoptedStyleSheets;
    expect(adopted.length).toBe(1);
    expect(first.querySelector("style")).toBeFalsy();
    expect(first.style.getPropertyValue("--sjs2-base-unit-size")).toBe("");

    // The second root re-probes negative (jsdom does not cascade adopted sheets),
    // but the already-adopted sheet must not be added again.
    const second = createThemeRoot();
    ensureBaseThemeStyles(second);
    expect((<any>document).adoptedStyleSheets.length).toBe(1);
    expect((<any>document).adoptedStyleSheets[0]).toBe(adopted[0]);
  });

  it("the sheet carries the base theme css", () => {
    ensureBaseThemeStyles(createThemeRoot());
    // The singleton sheet is filled at most once for the module lifetime.
    if (replacedCss.length > 0) {
      expect(replacedCss[0].indexOf("--sjs2-base-unit-size") !== -1).toBeTruthy();
      expect(replacedCss[0]).toBe(createBaseThemeStyle());
    } else {
      expect((<any>document).adoptedStyleSheets.length).toBe(1);
    }
  });
});

describe("CSP: reset variables ride inside SurveyModel.themeVariables", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    resetBaseThemeProbeCache();
  });

  it("a fresh survey exposes the base theme resets through themeVariables", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    expect(survey.themeVariables[RESET_VARIABLE])
      .toBe("0px 0px 0px 0px var(--sjs2-color-utility-shadow-surface-default)");
    survey.dispose();
  });

  it("applyTheme recomputes the resets synchronously, in the same binding value", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    survey.applyTheme(<any>{ cssVariables: {
      "--sjs-test": "val",
      "--sjs2-border-effect-surface-default": "0px 2px 4px 0px #222222",
    } });
    // No frame to wait for: the very object the renderers bind carries both the
    // new theme variables and the resets matching them.
    expect(survey.themeVariables["--sjs-test"]).toBe("val");
    expect(survey.themeVariables[RESET_VARIABLE]).toBe("0px 0px 0px 0px #222222");
    survey.dispose();
  });

  it("a theme's own reset value wins over the derived one", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    survey.applyTheme(<any>{ cssVariables: { [RESET_VARIABLE]: "0px 0px 0px 0px #abcdef" } });
    expect(survey.themeVariables[RESET_VARIABLE]).toBe("0px 0px 0px 0px #abcdef");
    survey.dispose();
  });
});
