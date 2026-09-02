import baseTheme from "../default-theme/base-theme";
import { DomDocumentHelper } from "../global_variables_utils";
import { createBoxShadowReset } from "./shadow-effects";

const VARIABLES_PER_RULE = 300;
// A variable that is always present in the base theme: used to detect whether the
// variables have already been delivered by a stylesheet (survey-core.css ships them).
const PROBE_VARIABLE = "--sjs2-base-unit-size";
const RESET_TARGET_VARIABLES = [
  "--sjs2-border-effect-surface-default",
  "--sjs2-border-effect-surface-focused",
  "--sjs2-border-effect-component-formbox-default",
  "--sjs2-border-effect-component-formbox-focused"
];

let cachedCss: string | undefined;

// The same CSS ships inside survey-core.css via the committed, tooling-generated
// src/default-theme/base-theme.scss; csp_tests.ts asserts both stay in sync.
export function buildBaseThemeCss(cssVariables: { [index: string]: string }): string {
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

export function createBaseThemeStyle(): string {
  const cssVariables = baseTheme.cssVariables;
  if (!cssVariables) return "";
  return buildBaseThemeCss(cssVariables);
}

// True when the base theme variables already reach `htmlElement` through a stylesheet
// (survey-core.css ships them). Injecting a <style> is then unnecessary - and refused
// anyway under a strict `style-src` CSP. A negative answer falls back to injection, so
// the failure direction is safe: consumers whose CSS is not a real stylesheet (a shadow
// root linking at document level, or a dev server serving CSS as an inline <style>)
// keep the previous behavior.
export function areBaseThemeVariablesApplied(htmlElement?: Element): boolean {
  if (!DomDocumentHelper.isAvailable() || !htmlElement) return false;
  const value = DomDocumentHelper.getComputedStyle(htmlElement)?.getPropertyValue(PROBE_VARIABLE);
  return typeof value === "string" && value.trim() !== "";
}

let cachedBaseResetVariables: { [index: string]: string };

// The reset counterparts of the base theme's border effects, derived from the RAW
// theme values rather than from a computed style: parseBoxShadow zeroes the length
// components (a `var()` length parses to 0) and keeps the color as a live `var()`
// reference, so the reset follows the active theme through the cascade without ever
// being recomputed. Static delivery matters: a value set on the element through CSSOM
// is wiped whenever a framework re-renders the root's style attribute from a binding.
export function createBaseThemeBoxShadowResetVariables(): { [index: string]: string } {
  if (!cachedBaseResetVariables) {
    cachedBaseResetVariables = {};
    const cssVariables = baseTheme.cssVariables || {};
    RESET_TARGET_VARIABLES.forEach((varName) => {
      const boxShadow = (<any>cssVariables)[varName];
      if (typeof boxShadow === "string" && boxShadow.trim() !== "") {
        cachedBaseResetVariables[`${varName}-reset`] = createBoxShadowReset(boxShadow);
      }
    });
  }
  return cachedBaseResetVariables;
}

let cachedDocumentProbe: boolean | undefined;

// The document-level counterpart of areBaseThemeVariablesApplied: it answers the same
// question before a survey root exists, which is when the renderers read `themeStyle`.
// A survey rendered into a shadow root that carries its own stylesheet probes negative
// here and keeps injecting - which is correct, since the document has no variables.
// Deliberate tradeoffs: the probe briefly appends a hidden node to <body> from the
// first render (a one-time, synchronous mutation - the result is cached for the page
// lifetime), and a stylesheet that loads after the first survey renders leaves the
// cache negative, so the runtime keeps injecting the variables - a harmless
// duplication, never a loss of styling. SurveyModel.afterRenderSurvey() re-probes
// per root element and heals the opposite case (see applyResetVariables).
export function areBaseThemeVariablesInDocument(): boolean {
  if (cachedDocumentProbe !== undefined) return cachedDocumentProbe;
  if (!DomDocumentHelper.isAvailable()) return false;
  const body = DomDocumentHelper.getBody();
  if (!body) return false;
  const probe = DomDocumentHelper.createElement("div") as HTMLElement;
  if (!probe) return false;
  probe.className = "sd-theme-root";
  probe.style.display = "none";
  body.appendChild(probe);
  cachedDocumentProbe = areBaseThemeVariablesApplied(probe);
  body.removeChild(probe);
  return cachedDocumentProbe;
}

export function resetBaseThemeProbeCache(): void {
  cachedDocumentProbe = undefined;
}

let constructedSheet: CSSStyleSheet | undefined;

// Both fallback deliveries below go through CSSOM, which a `style-src` CSP does not
// police - an injected <style> element would be refused without a nonce.
function adoptBaseThemeStyleSheet(rootNode: any): boolean {
  try {
    if (typeof CSSStyleSheet !== "function" || typeof (<any>CSSStyleSheet.prototype).replaceSync !== "function") return false;
    if (!rootNode || !("adoptedStyleSheets" in rootNode)) return false;
    if (!constructedSheet) {
      const sheet = new CSSStyleSheet();
      if (cachedCss === undefined) {
        cachedCss = createBaseThemeStyle();
      }
      (<any>sheet).replaceSync(cachedCss);
      constructedSheet = sheet;
    }
    if (rootNode.adoptedStyleSheets.indexOf(constructedSheet) === -1) {
      // Reassigned rather than pushed: adoptedStyleSheets was a frozen array in the
      // first browser generations that shipped it.
      rootNode.adoptedStyleSheets = [...rootNode.adoptedStyleSheets, constructedSheet];
    }
    return true;
  } catch(e) {
    // E.g. a sheet constructed for another document realm - fall back to inline.
    return false;
  }
}

function applyBaseThemeVariablesInline(htmlElement: Element): void {
  const style = (<HTMLElement>htmlElement).style;
  const cssVariables = baseTheme.cssVariables;
  if (!style || !cssVariables) return;
  Object.keys(cssVariables).forEach((name) => {
    // A value already set on the element (by the page, or by themeVariables) wins -
    // the way it would win over a stylesheet delivery too.
    if (style.getPropertyValue(name) === "") {
      style.setProperty(name, (<any>cssVariables)[name]);
    }
  });
}

export function ensureBaseThemeStyles(htmlElement?: Element): void {
  if (!DomDocumentHelper.isAvailable() || !htmlElement) return;
  if (!areBaseThemeVariablesApplied(htmlElement)) {
    const rootNode = typeof (<any>htmlElement).getRootNode === "function"
      ? (<any>htmlElement).getRootNode()
      : DomDocumentHelper.getDocument();
    if (!adoptBaseThemeStyleSheet(rootNode)) {
      // Last resort for engines without constructable stylesheets. Inline custom
      // properties out-precede any stylesheet rule on this element, but in this
      // branch no stylesheet defines the variables anyway.
      applyBaseThemeVariablesInline(htmlElement);
    }
  }
  applyBoxShadowResetVars(htmlElement);
}

function getBoxShadowResetVars(htmlElement: Element): { [index: string]: string } {
  const cssVariables: { [index: string]: string } = {};
  const computedStyle = getComputedStyle(htmlElement);
  RESET_TARGET_VARIABLES.forEach((varName) => {
    const boxShadow = computedStyle.getPropertyValue(varName);
    // An empty value means the base variables have not been applied yet; emitting a
    // reset from it would silently produce "0px 0px 0px 0px #000000".
    if (typeof boxShadow === "string" && boxShadow.trim() !== "") {
      cssVariables[`${varName}-reset`] = createBoxShadowReset(boxShadow);
    }
  });
  return cssVariables;
}

export function createResetVariablesStyle(htmlElement?:Element): string {
  if (!DomDocumentHelper.isAvailable() || !htmlElement) return "";
  return buildBaseThemeCss(getBoxShadowResetVars(htmlElement));
}

// The reset variables are computed per root, so they are set on the element itself
// through CSSOM: that is not policed by CSP, and it also stops two surveys with
// different themes from overwriting each other through the shared class selector.
export function applyBoxShadowResetVars(htmlElement?: Element): void {
  if (!DomDocumentHelper.isAvailable() || !htmlElement) return;
  const style = (<HTMLElement>htmlElement).style;
  if (!style) return;
  const cssVariables = getBoxShadowResetVars(htmlElement);
  Object.keys(cssVariables).forEach((name) => style.setProperty(name, cssVariables[name]));
}

export function clearBoxShadowResetVars(htmlElement?: Element): void {
  const style = !!htmlElement ? (<HTMLElement>htmlElement).style : undefined;
  if (!style) return;
  RESET_TARGET_VARIABLES.forEach((varName) => style.removeProperty(`${varName}-reset`));
}

export function addBoxShadowResetVarsIntoStyles(htmlElement?:Element): void {
  applyBoxShadowResetVars(htmlElement);
}
