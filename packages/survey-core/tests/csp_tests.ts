import { describe, expect, it, afterEach } from "vitest";
import { settings } from "../src/settings";
import {
  buildBaseThemeCss,
  createBaseThemeStyle,
  ensureBaseThemeStyles,
  applyBoxShadowResetVars,
  clearBoxShadowResetVars,
  areBaseThemeVariablesApplied,
  areBaseThemeVariablesInDocument,
  resetBaseThemeProbeCache
} from "../src/utils/base-theme-init";
import { getStylesNonce, resetStylesNonceCache, createStyleElement, applyNonceToElement } from "../src/utils/csp-nonce";
import { generateBaseThemeCss, renderBaseThemeScss, BASE_THEME_SCSS_PATH } from "../scripts/build-base-theme-css.mjs";
import { SurveyModel } from "../src/survey";
import * as fs from "fs";

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

  it("the build-time generator emits exactly what the runtime would inject", () => {
    expect(generateBaseThemeCss()).toBe(createBaseThemeStyle());
  });

  // The generated scss is committed so that a fresh checkout compiles without a build;
  // every build rewrites it (see writeBaseThemeScss in rollup.config.mjs), and this
  // test catches a base-theme.ts edit committed without the regenerated file.
  it("the committed base-theme-variables.generated.scss is in sync with base-theme.ts", () => {
    expect(fs.readFileSync(BASE_THEME_SCSS_PATH, "utf8")).toBe(renderBaseThemeScss());
  });

  it("the generated css defines the variables under the theme root class", () => {
    const css = buildBaseThemeCss({ "--test-a": "1px", "--test-b": "2px" });
    expect(css).toBe(":where(.sd-theme-root) {\n  --test-a: 1px;\n  --test-b: 2px;\n}");
  });

  it("injects a style element when the variables are missing", () => {
    const root = createThemeRoot();
    ensureBaseThemeStyles(root);
    const styleElement = root.querySelector("style[data-survey-base-theme-variables]");
    expect(styleElement).toBeTruthy();
    expect(styleElement.textContent.indexOf("--sjs2-base-unit-size") !== -1).toBeTruthy();
  });

  it("skips the injection when a stylesheet already applies the variables", () => {
    const stylesheet = document.createElement("style");
    stylesheet.textContent = ":where(.sd-theme-root) { --sjs2-base-unit-size: 8px; }";
    document.head.appendChild(stylesheet);
    const root = createThemeRoot();
    expect(areBaseThemeVariablesApplied(root)).toBeTruthy();

    ensureBaseThemeStyles(root);
    expect(root.querySelector("style[data-survey-base-theme-variables]")).toBeFalsy();
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

describe("CSP: nonce for injected style elements", () => {
  afterEach(() => {
    settings.cspNonce = undefined;
    resetStylesNonceCache();
    document.head.querySelectorAll("script[nonce]").forEach((el) => el.remove());
    document.body.innerHTML = "";
    resetBaseThemeProbeCache();
  });

  it("uses the nonce from settings", () => {
    settings.cspNonce = "abc";
    expect(getStylesNonce()).toBe("abc");
    expect(createStyleElement("a{}").getAttribute("nonce")).toBe("abc");
  });

  it("auto-detects the nonce from the page", () => {
    const script = document.createElement("script");
    script.setAttribute("nonce", "page-nonce");
    document.head.appendChild(script);
    resetStylesNonceCache();
    expect(getStylesNonce()).toBe("page-nonce");
  });

  it("an explicit setting wins over auto-detection", () => {
    const script = document.createElement("script");
    script.setAttribute("nonce", "page-nonce");
    document.head.appendChild(script);
    resetStylesNonceCache();
    settings.cspNonce = "explicit";
    expect(getStylesNonce()).toBe("explicit");
  });

  it("an empty setting disables the nonce", () => {
    const script = document.createElement("script");
    script.setAttribute("nonce", "page-nonce");
    document.head.appendChild(script);
    resetStylesNonceCache();
    settings.cspNonce = "";
    expect(getStylesNonce()).toBe("");
    expect(createStyleElement("a{}").hasAttribute("nonce")).toBeFalsy();
  });

  it("emits no nonce attribute when the page has none", () => {
    resetStylesNonceCache();
    expect(getStylesNonce()).toBe("");
    expect(createStyleElement("a{}").hasAttribute("nonce")).toBeFalsy();
  });

  it("stamps the nonce onto the injected base theme style element", () => {
    settings.cspNonce = "abc";
    const root = createThemeRoot();
    ensureBaseThemeStyles(root);
    expect(root.querySelector("style[data-survey-base-theme-variables]").getAttribute("nonce")).toBe("abc");
  });

  it("applyNonceToElement tolerates a missing element", () => {
    settings.cspNonce = "abc";
    expect(() => applyNonceToElement(undefined)).not.toThrow();
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
