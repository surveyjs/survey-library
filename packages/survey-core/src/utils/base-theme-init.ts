import baseTheme from "../default-theme/base-theme";
import { defaultCss } from "../defaultCss/defaultCss";
import { DomDocumentHelper } from "../global_variables_utils";
import { createBoxShadowReset } from "./shadow-effects";

const STYLE_ELEMENT_ATTR = "data-survey-base-theme-variables";
const VARIABLES_PER_RULE = 50;

const THEME_ROOT_CLASS = "sd-theme-root";

// Describes the `@scope` for a component. A plain string is shorthand for the
// scope root only; an object additionally sets the scope `limit` so the
// component variables stop applying at (and below) the limit element, i.e.
// `@scope (<root>) to (<limit>)`. The values are native CSS selectors written
// as-is (include the leading `.` for classes); the code does not add it.
type ThemeComponentScope = string | { root: string, limit?: string };

// Maps a component name (as used in `-component-<name>` CSS variable tokens) to
// the native CSS selector(s) that serve as the `@scope` root (and optional
// limit) for that component. A variable that matches one of these components is
// emitted inside `@scope (<root>) [to (<limit>)] { :scope { ... } }` instead of
// the shared `sd-theme-root` scope, so it only resolves within the matching
// component subtree, without introducing any new CSS classes. Everything else
// stays in `sd-theme-root`.
const THEME_COMPONENT_SCOPES: { [component: string]: ThemeComponentScope } = {
  boolean: ".sd-boolean-root",
  buttongroup: ".sv-button-group",
  ranking: ".sv-ranking",
  rating: ".sd-rating",
  slider: ".sd-slider",
  tagbox: ".sd-tagbox",
  action: ".sd-action",
  check: ".sd-checkbox",
  checkbox: ".sd-checkbox",
  formbox: ".sd-formbox",
  input: ".sd-formbox",
  radio: ".sd-radio",
  panel: { root: ".sd-panel, .sd-question", limit: ".sd-panel__content, .sd-question__content" },
  // The components below also have `-component-<name>` tokens. Provide the
  // scope root (and optional limit) selector and uncomment the entry to scope
  // their variables, e.g. `panel: { root: ".sd-panel", limit: ".sd-question" }`,
  // which emits `@scope (.sd-panel) to (.sd-question)`.
  // caption: "",
  drop: ".sd-dropdown",
  header: { root: ".sd-root-modern", limit: ".sd-body" },
  // icon: "",
  image: ".sd-image",
  // label: "",
  labeled: ".sd-selectbase",
  // menu: ".sd-menu-list",
  // message: "",
  modal: ".sv-popup",
  // notifier: ".sv-notifier",
  page: { root: ".sd-page", limit: ".sd-page__row" },
  question: { root: ".sd-question", limit: ".sd-question__content" },
  // stepper: "",
  // swatch: "",
  // toggle: "",
  // tooltip: "",
  upload: ".sd-file",
};

let cachedCss: string | undefined;

function getThemeComponentName(variableName: string): string | undefined {
  if (variableName.indexOf("component") === -1) return undefined;
  const components = Object.keys(THEME_COMPONENT_SCOPES);
  for (let i = 0; i < components.length; i++) {
    const name = components[i];
    const marker = `-component-${name}`;
    const index = variableName.indexOf(marker);
    if (index === -1) continue;
    const nextChar = variableName.charAt(index + marker.length);
    if (nextChar === "" || nextChar === "-") return name;
  }
  return undefined;
}

function getThemeScopePrelude(scope: ThemeComponentScope): string {
  const root = typeof scope === "string" ? scope : scope.root;
  const limit = typeof scope === "string" ? undefined : scope.limit;
  return limit ? `@scope (${root}) to (${limit})` : `@scope (${root})`;
}

function buildDeclarations(names: string[], cssVariables: { [index: string]: string }, indent: string): string {
  return names.map((name) => `${indent}${name}: ${cssVariables[name]};`).join("\n");
}

function buildBaseThemeCss(cssVariables: { [index: string]: string }): string {
  const rootNames: string[] = [];
  const componentNames: { [name: string]: string[] } = {};

  Object.keys(cssVariables).forEach((name) => {
    const componentName = getThemeComponentName(name);
    if (componentName) {
      if (!componentNames[componentName]) componentNames[componentName] = [];
      componentNames[componentName].push(name);
    } else {
      rootNames.push(name);
    }
  });

  const rules: string[] = [];

  for (let i = 0; i < rootNames.length; i += VARIABLES_PER_RULE) {
    const declarations = buildDeclarations(rootNames.slice(i, i + VARIABLES_PER_RULE), cssVariables, "  ");
    rules.push(`:where(.${THEME_ROOT_CLASS}) {\n${declarations}\n}`);
  }

  Object.keys(componentNames).forEach((componentName) => {
    const scopePrelude = getThemeScopePrelude(THEME_COMPONENT_SCOPES[componentName]);
    const names = componentNames[componentName];
    for (let i = 0; i < names.length; i += VARIABLES_PER_RULE) {
      const declarations = buildDeclarations(names.slice(i, i + VARIABLES_PER_RULE), cssVariables, "    ");
      rules.push(`${scopePrelude} {\n  :scope {\n${declarations}\n  }\n}`);
    }
  });

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
