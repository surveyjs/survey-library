import baseTheme from "../default-theme/base-theme";
import { defaultCss } from "../defaultCss/defaultCss";
import { DomDocumentHelper } from "../global_variables_utils";

const STYLE_ELEMENT_ATTR = "data-survey-base-theme-variables";
const VARIABLES_PER_RULE = 50;

let cachedCss: string | undefined;

function buildBaseThemeCss(cssVariables: { [index: string]: string }): string {
  const themeRootClass = defaultCss.rootTheme;
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

/**
 * Injects BaseTheme CSS variables into a local `<style>` element inside `htmlElement`.
 * Called from `SurveyModel.afterRenderSurvey()` after the survey root is mounted.
 */
export function ensureBaseThemeStyles(htmlElement?: Element): void {
  if (!DomDocumentHelper.isAvailable() || !htmlElement) return;

  const cssVariables = baseTheme.cssVariables;
  if (!cssVariables) return;

  let styleElement = findStyleElement(htmlElement);
  if (!styleElement) {
    styleElement = DomDocumentHelper.createElement("style") as HTMLStyleElement;
    styleElement.setAttribute(STYLE_ELEMENT_ATTR, "");
    htmlElement.insertBefore(styleElement, htmlElement.firstChild);
  }

  if (cachedCss === undefined) {
    cachedCss = buildBaseThemeCss(cssVariables);
  }
  if (styleElement.textContent !== cachedCss) {
    styleElement.textContent = cachedCss;
  }
}
