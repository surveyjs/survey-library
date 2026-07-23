import baseTheme from "../default-theme/base-theme";
import { defaultCss } from "../defaultCss/defaultCss";
import { DomDocumentHelper } from "../global_variables_utils";
import { createBoxShadowReset } from "./shadow-effects";

const STYLE_ELEMENT_ATTR = "data-survey-base-theme-variables";
const VARIABLES_PER_RULE = 300;

// Variables that are read back via getComputedStyle at runtime (see
// createResetVariablesStyle). They are the only default declarations the
// runtime needs: all other defaults are baked into the compiled CSS as var()
// fallback chains by the postcss-sjs2-fallbacks build plugin.
const RUNTIME_CONSUMED_VARIABLES = [
  "--sjs2-border-effect-surface-default",
  "--sjs2-border-effect-surface-focused",
  "--sjs2-border-effect-component-formbox-default",
  "--sjs2-border-effect-component-formbox-focused"
];

export const baseThemeStylesSettings = {
  // Restores the legacy behavior of declaring every base theme variable
  // (~1500) on the survey root at runtime. Only needed when custom stylesheets
  // consume --sjs2-* variables without fallbacks. Declared custom properties
  // are inherited by every element and make browser DevTools'
  // Elements > Styles panel very slow, so keep this off unless required.
  // Set before the first survey is rendered.
  injectAllDefaultVariables: false
};

let cachedCss: string | undefined;
let cachedCssAllVariables: boolean | undefined;

const VARIABLE_REFERENCE_REGEX = /var\(\s*(--[\w-]+)\s*\)/g;

// Expands bare var(--x) references inside a value into var(--x, <default>)
// chains, so the declared value resolves without the full default set being
// present, while an override at any level of the chain still takes effect.
function expandVariableValue(value: string, stack: { [index: string]: boolean }): string {
  const cssVariables: { [index: string]: string } = baseTheme.cssVariables;
  return value.replace(VARIABLE_REFERENCE_REGEX, (full: string, name: string): string => {
    const defaultValue = cssVariables[name];
    if (defaultValue === undefined || stack[name]) return full;
    stack[name] = true;
    const expanded = expandVariableValue(defaultValue, stack);
    stack[name] = false;
    return `var(${name}, ${expanded})`;
  });
}

// Expands bare var() references inside theme-provided CSS variable values into
// fallback chains. Theme values may reference base variables (authored
// directly, or produced by the legacy variable conversion in themes.ts, e.g.
// "var(--sjs2-color-bg-brand-primary)"). They are applied as inline styles on
// the survey root and header, where the fallbacks baked into the compiled CSS
// do not reach, so without expansion such references resolve to nothing.
export function expandThemeCssVariables(cssVariables: { [index: string]: string }): void {
  if (!cssVariables) return;
  Object.keys(cssVariables).forEach((name) => {
    const value = cssVariables[name];
    if (typeof value === "string" && value.indexOf("var(") !== -1) {
      cssVariables[name] = expandVariableValue(value, {});
    }
  });
}

function buildBaseThemeCss(cssVariables: { [index: string]: string }): string {
  const themeRootClass = "sd-theme-root";
  const names = Object.keys(cssVariables);
  const rules: string[] = [];

  for (let i = 0; i < names.length; i += VARIABLES_PER_RULE) {
    const declarations = names
      .slice(i, i + VARIABLES_PER_RULE)
      .map((name) => `  ${name}: ${cssVariables[name]};`)
      .join("\n");
    rules.push(`:where(.${themeRootClass}) {\n${declarations}\n}`);
  }

  return rules.join("\n");
}

function findStyleElement(htmlElement: Element): HTMLStyleElement | null {
  for (let i = 0; i < htmlElement.children.length; i++) {
    const child = htmlElement.children[i];
    if (child.tagName === "STYLE" && child.hasAttribute(STYLE_ELEMENT_ATTR)) {
      return child as HTMLStyleElement;
    }
  }
  return null;
}

export function ensureStyleElement(htmlElement: Element): HTMLStyleElement | null {
  let styleElement = findStyleElement(htmlElement);
  if (!styleElement) {
    styleElement = DomDocumentHelper.createElement("style") as HTMLStyleElement;
    styleElement.setAttribute(STYLE_ELEMENT_ATTR, "");
    htmlElement.insertBefore(styleElement, htmlElement.firstChild);
  }
  return styleElement;
}

export function createBaseThemeStyle(): string {
  const cssVariables: { [index: string]: string } = baseTheme.cssVariables;
  if (!cssVariables) return "";
  if (baseThemeStylesSettings.injectAllDefaultVariables) {
    return buildBaseThemeCss(cssVariables);
  }
  const runtimeVariables: { [index: string]: string } = {};
  RUNTIME_CONSUMED_VARIABLES.forEach((name) => {
    const value = cssVariables[name];
    if (value !== undefined) {
      runtimeVariables[name] = expandVariableValue(value, {});
    }
  });
  return buildBaseThemeCss(runtimeVariables);
}

/**
 * Injects BaseTheme CSS variables into a local `<style>` element inside `htmlElement`.
 * Called from `SurveyModel.afterRenderSurvey()` after the survey root is mounted.
 */
export function ensureBaseThemeStyles(htmlElement?: Element): void {
  if (!DomDocumentHelper.isAvailable() || !htmlElement) return;
  const styleElement = ensureStyleElement(htmlElement);
  if (cachedCss === undefined || cachedCssAllVariables !== baseThemeStylesSettings.injectAllDefaultVariables) {
    cachedCss = createBaseThemeStyle();
    cachedCssAllVariables = baseThemeStylesSettings.injectAllDefaultVariables;
  }
  // Make the base variables resolvable before reading them back for the reset
  // variables (they are derived from computed values).
  if (!styleElement.textContent) {
    styleElement.textContent = cachedCss;
  }
  const fullCss = `${cachedCss}\n${createResetVariablesStyle(htmlElement)}`;
  // Rewriting the style element invalidates the CSSOM (a full re-parse plus a
  // style recalc, and open DevTools re-fetch the stylesheet), so only write
  // when the content actually changed.
  if (styleElement.textContent !== fullCss) {
    styleElement.textContent = fullCss;
  }
}

export function createResetVariablesStyle(htmlElement?:Element): string {
  if (!DomDocumentHelper.isAvailable() || !htmlElement) return "";
  const cssVariables: { [index: string]: string } = {};
  const computedStyle = getComputedStyle(htmlElement);
  RUNTIME_CONSUMED_VARIABLES.forEach((varName) => {
    const boxShadow = computedStyle.getPropertyValue(varName);
    if (typeof boxShadow === "string") {
      cssVariables[`${varName}-reset`] = createBoxShadowReset(boxShadow);
    }
  });
  return buildBaseThemeCss(cssVariables);
}

export function addBoxShadowResetVarsIntoStyles(htmlElement?:Element): void {
  const styleElement = ensureStyleElement(htmlElement);
  styleElement.textContent += `\n${createResetVariablesStyle(htmlElement)}`;
}
