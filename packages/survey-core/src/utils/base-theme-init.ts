import baseTheme from "../default-theme/base-theme";
import { defaultCss } from "../defaultCss/defaultCss";
import { DomDocumentHelper } from "../global_variables_utils";
import { createBoxShadowReset } from "./shadow-effects";

const STYLE_ELEMENT_ATTR = "data-survey-base-theme-variables";
const VARIABLES_PER_RULE = 50;

let cachedCss: string | undefined;

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
  const cssVariables = baseTheme.cssVariables;
  if (!cssVariables) return "";
  return buildBaseThemeCss(cssVariables);
}

/**
 * Injects BaseTheme CSS variables into a local `<style>` element inside `htmlElement`.
 * Called from `SurveyModel.afterRenderSurvey()` after the survey root is mounted.
 */
export function ensureBaseThemeStyles(htmlElement?: Element): void {
  if (!DomDocumentHelper.isAvailable() || !htmlElement) return;
  const styleElement = ensureStyleElement(htmlElement);
  if (cachedCss === undefined) {
    cachedCss = createBaseThemeStyle();
  }
  if (styleElement.textContent !== cachedCss) {
    styleElement.textContent = cachedCss;
  }
  addBoxShadowResetVarsIntoStyles(htmlElement);
}

export function createResetVariablesStyle(htmlElement?:Element): string {
  if (!DomDocumentHelper.isAvailable() || !htmlElement) return "";
  const cssVariables: { [index: string]: string } = {};
  const targetVars = [
    "--sjs2-border-effect-surface-default",
    "--sjs2-border-effect-surface-focused",
    "--sjs2-border-effect-component-formbox-default",
    "--sjs2-border-effect-component-formbox-focused"
  ];
  const computedStyle = getComputedStyle(htmlElement);
  targetVars.forEach((varName) => {
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
