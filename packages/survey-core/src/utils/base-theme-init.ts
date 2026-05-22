import baseTheme from "../default-theme/base-theme";
import { DomDocumentHelper } from "../global_variables_utils";
import { settings } from "../settings";
import { isShadowDOM } from "../utils/dom-utils";

export { BaseTheme } from "../default-theme/base-theme-init";

const STYLE_ELEMENT_ID = "survey-base-theme-variables";
const THEME_ROOT_CLASS = "sd-theme-root";
const VARIABLES_PER_RULE = 50;

type StyleParent = Document | ShadowRoot | HTMLElement;

let cachedCss: string | undefined;
const initializedRoots: Array<Document | ShadowRoot> = [];

function buildBaseThemeCss(cssVariables: { [index: string]: string }): string {
  const names = Object.keys(cssVariables);
  const rules: string[] = [];

  for (let i = 0; i < names.length; i += VARIABLES_PER_RULE) {
    const declarations = names
      .slice(i, i + VARIABLES_PER_RULE)
      .map((name) => `  ${name}: ${cssVariables[name]};`)
      .join("\n");
    rules.push(`.${THEME_ROOT_CLASS} {\n${declarations}\n}`);
  }

  return rules.join("\n");
}

function getRootNodeFor(htmlElement?: Element): Document | ShadowRoot | null {
  if (!!htmlElement && typeof htmlElement.getRootNode === "function") {
    const rootNode = htmlElement.getRootNode();
    if (rootNode instanceof Document || (typeof ShadowRoot !== "undefined" && rootNode instanceof ShadowRoot)) {
      return rootNode as Document | ShadowRoot;
    }
  }
  const envRoot = settings.environment?.root;
  if (envRoot instanceof Document || (typeof ShadowRoot !== "undefined" && envRoot instanceof ShadowRoot)) {
    return envRoot;
  }
  return DomDocumentHelper.getDocument() || null;
}

function getStyleParent(rootNode: Document | ShadowRoot): StyleParent {
  const mountContainer = settings.environment?.stylesSheetsMountContainer;
  if (mountContainer && rootNode.contains(mountContainer)) {
    return mountContainer;
  }
  if (isShadowDOM(rootNode)) {
    return rootNode;
  }
  return (rootNode as Document).head || rootNode;
}

function findStyleElement(parent: StyleParent): HTMLStyleElement | null {
  if (parent instanceof Document) {
    return parent.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;
  }
  return parent.querySelector(`#${STYLE_ELEMENT_ID}`) as HTMLStyleElement | null;
}

export function ensureBaseThemeStyles(htmlElement?: Element): void {
  if (!DomDocumentHelper.isAvailable()) return;

  const cssVariables = baseTheme.cssVariables;
  if (!cssVariables) return;

  const rootNode = getRootNodeFor(htmlElement);
  if (!rootNode) return;

  if (initializedRoots.indexOf(rootNode) !== -1) return;

  const parent = getStyleParent(rootNode);
  let styleElement = findStyleElement(parent);
  if (!styleElement) {
    styleElement = DomDocumentHelper.createElement("style") as HTMLStyleElement;
    styleElement.id = STYLE_ELEMENT_ID;
    parent.appendChild(styleElement);
  }

  if (cachedCss === undefined) {
    cachedCss = buildBaseThemeCss(cssVariables);
  }
  if (styleElement.textContent !== cachedCss) {
    styleElement.textContent = cachedCss;
  }

  initializedRoots.push(rootNode);
}
