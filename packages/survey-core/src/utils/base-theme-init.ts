import baseTheme from "../default-theme/base-theme";
import { defaultCss } from "../defaultCss/defaultCss";
import { DomDocumentHelper } from "../global_variables_utils";
import { createBoxShadowReset } from "./shadow-effects";

const STYLE_ELEMENT_ATTR = "data-survey-base-theme-variables";
const VARIABLES_PER_RULE = 50;

const THEME_ROOT_CLASS = "sd-theme-root";

// Maps a component name (as used in `-component-<name>` CSS variable tokens) to
// the native CSS selector of the class where that component's variables are
// defined. Values are written as-is (include the leading `.` for classes); the
// code does not add it. A variable that matches one of these components is
// emitted inside `:where(<selector>) { ... }` instead of the shared
// `sd-theme-root` rule. Everything else stays in `sd-theme-root`.
const THEME_COMPONENT_SCOPES: { [component: string]: string } = {
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
  panel: ".sd-panel, .sd-question",
  // The components below also have `-component-<name>` tokens. Provide the
  // class selector and uncomment the entry to place their variables there,
  // e.g. `panel: ".sd-panel"`.
  // caption: "",
  drop: ".sd-dropdown",
  header: ".sd-root-modern",
  // icon: "",
  image: ".sd-image",
  // label: "",
  labeled: ".sd-selectbase",
  // menu: ".sd-menu-list",
  // message: "",
  modal: ".sv-popup",
  // notifier: ".sv-notifier",
  page: ".sd-page",
  question: ".sd-question",
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

function buildDeclarations(names: string[], cssVariables: { [index: string]: string }, indent: string): string {
  return names.map((name) => `${indent}${name}: ${cssVariables[name]};`).join("\n");
}

function buildVariableRules(selector: string, names: string[], cssVariables: { [index: string]: string }): string[] {
  const rules: string[] = [];
  for (let i = 0; i < names.length; i += VARIABLES_PER_RULE) {
    const declarations = buildDeclarations(names.slice(i, i + VARIABLES_PER_RULE), cssVariables, "  ");
    rules.push(`:where(${selector}) {\n${declarations}\n}`);
  }
  return rules;
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

  const rules: string[] = buildVariableRules(`.${THEME_ROOT_CLASS}`, rootNames, cssVariables);

  Object.keys(componentNames).forEach((componentName) => {
    rules.push(...buildVariableRules(THEME_COMPONENT_SCOPES[componentName], componentNames[componentName], cssVariables));
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
