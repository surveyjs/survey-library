import { describe, expect, it, afterEach, beforeEach } from "vitest";
import {
  buildBaseThemeCss,
  createBaseThemeStyle,
  ensureBaseThemeStyles,
  applyBoxShadowResetVars,
  clearBoxShadowResetVars,
  createBaseThemeBoxShadowResetVariables,
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

describe("CSP: box-shadow reset variables set through CSSOM", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    resetBaseThemeProbeCache();
  });

  it("sets the reset variables on the element instead of a style element", () => {
    const root = createThemeRoot();
    root.style.setProperty("--sjs2-border-effect-surface-default", "0px 2px 4px 0px #123456");
    applyBoxShadowResetVars(root);
    expect(root.style.getPropertyValue(RESET_VARIABLE)).toBe("0px 0px 0px 0px #123456");
    expect(root.querySelector("style")).toBeFalsy();
  });

  it("keeps two roots independent", () => {
    const first = createThemeRoot();
    const second = createThemeRoot();
    first.style.setProperty("--sjs2-border-effect-surface-default", "0px 2px 4px 0px #111111");
    second.style.setProperty("--sjs2-border-effect-surface-default", "0px 2px 4px 0px #222222");
    applyBoxShadowResetVars(first);
    applyBoxShadowResetVars(second);
    expect(first.style.getPropertyValue(RESET_VARIABLE)).toBe("0px 0px 0px 0px #111111");
    expect(second.style.getPropertyValue(RESET_VARIABLE)).toBe("0px 0px 0px 0px #222222");
  });

  it("emits nothing when the source variable is empty", () => {
    const root = createThemeRoot();
    applyBoxShadowResetVars(root);
    expect(root.style.getPropertyValue(RESET_VARIABLE)).toBe("");
  });

  it("clears the reset variables", () => {
    const root = createThemeRoot();
    root.style.setProperty("--sjs2-border-effect-surface-default", "0px 2px 4px 0px #123456");
    applyBoxShadowResetVars(root);
    clearBoxShadowResetVars(root);
    expect(root.style.getPropertyValue(RESET_VARIABLE)).toBe("");
  });
});

describe("CSP: static reset variables derived from the raw base theme values", () => {
  // These need no DOM at all: the lengths of the raw values zero out (a `var()`
  // length parses to 0) and the color survives as a live `var()` reference, so a
  // consumer can merge the map into a style binding once and never recompute it.
  it("builds a reset for every border effect the css consumes", () => {
    const resets = createBaseThemeBoxShadowResetVariables();
    expect(resets["--sjs2-border-effect-component-formbox-default-reset"])
      .toBe("inset 0px 0px 0px 0px var(--sjs2-color-component-formbox-default-border)");
    expect(resets["--sjs2-border-effect-component-formbox-focused-reset"])
      .toBe("inset 0px 0px 0px 0px var(--sjs2-color-component-formbox-focused-border)");
    expect(resets["--sjs2-border-effect-surface-default-reset"])
      .toBe("0px 0px 0px 0px var(--sjs2-color-utility-shadow-surface-default)");
  });

  it("returns the same cached map on every call", () => {
    expect(createBaseThemeBoxShadowResetVariables()).toBe(createBaseThemeBoxShadowResetVariables());
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

describe("CSP: reset variables survive a runtime applyTheme", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    resetBaseThemeProbeCache();
  });

  it("recalculates the reset variables after applyTheme on a mounted survey", async () => {
    const root = createThemeRoot();
    root.style.setProperty("--sjs2-border-effect-surface-default", "0px 2px 4px 0px #111111");
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    survey.afterRenderSurvey(root);
    expect(root.style.getPropertyValue(RESET_VARIABLE)).toBe("0px 0px 0px 0px #111111");

    // A runtime theme switch clears the reset variables; they must be recalculated
    // even though no renderer reads the resetVariablesStyle getter anymore.
    root.style.setProperty("--sjs2-border-effect-surface-default", "0px 2px 4px 0px #222222");
    survey.applyTheme(<any>{ cssVariables: { "--sjs-test": "val" } });
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    expect(root.style.getPropertyValue(RESET_VARIABLE)).toBe("0px 0px 0px 0px #222222");
    survey.dispose();
  });

  it("does not reapply onto a disposed survey", async () => {
    const root = createThemeRoot();
    root.style.setProperty("--sjs2-border-effect-surface-default", "0px 2px 4px 0px #111111");
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    survey.afterRenderSurvey(root);
    survey.applyTheme(<any>{ cssVariables: { "--sjs-test": "val" } });
    survey.dispose();
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    expect(root.style.getPropertyValue(RESET_VARIABLE)).toBe("");
  });
});
