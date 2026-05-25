import { DomDocumentHelper } from "../global_variables_utils";
import { getRGBaColor } from "./color";
import { createBoxShadow, parseBoxShadow } from "./shadow-effects";

const THEME_ROOT_CLASS = "sd-theme-root";

function getCssVariableProxyProperty(varName: string): string | null {
  if (varName.indexOf("color") !== -1 || varName.indexOf("palette") !== -1) return "color";
  if (varName.indexOf("border-effect") !== -1) return "box-shadow";
  if (varName.indexOf("font-family") !== -1) return null;
  if (varName.indexOf("font-weight") !== -1) return null;
  if (varName.indexOf("text-case") !== -1) return null;
  if (varName.indexOf("opacity") !== -1) return null;
  if (varName.indexOf("scale") !== -1) return null;
  return "width";
}

function normalizeCssVariableValue(value: string, proxyProperty: string | null): string {
  if (value == null) return value;
  if (proxyProperty === "color" && value !== "transparent") {
    return getRGBaColor(value) || value;
  }
  if (proxyProperty === "box-shadow") {
    return createBoxShadow(parseBoxShadow(value)) || value;
  }
  return value;
}

function createCssVariableProbeElement(host: HTMLElement): HTMLElement | null {
  const div = DomDocumentHelper.createElement("div") as HTMLElement;
  if (!div) return null;
  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.top = "0";
  div.style.left = "0";
  host.appendChild(div);
  return div;
}

export function getComputedCssVariableValue(varName: string, rootElement?: HTMLElement): string {
  const host = rootElement || DomDocumentHelper.getBody() || DomDocumentHelper.getDocumentElement();
  if (!host) return "";

  const proxyProperty = getCssVariableProxyProperty(varName);
  if (proxyProperty === null) {
    return DomDocumentHelper.getComputedStyle(host).getPropertyValue(varName).trim();
  }

  const tempElement = createCssVariableProbeElement(host);
  if (!tempElement) return "";
  try {
    tempElement.style.setProperty(proxyProperty, `var(${varName})`);
    const value = DomDocumentHelper.getComputedStyle(tempElement).getPropertyValue(proxyProperty);
    return normalizeCssVariableValue(value, proxyProperty);
  } finally {
    host.removeChild(tempElement);
  }
}

export function getComputedCssVariableValues(
  cssVariables: { [key: string]: string } = {},
  additionalCssVariables: string[] = [],
  rootElement?: HTMLElement
): { [key: string]: string } {
  const sourceCssVariables: { [key: string]: string } = cssVariables || {};
  const hasCssVariablesToApply = Object.keys(sourceCssVariables).length > 0;
  const clonedCssVariables: { [key: string]: string } = hasCssVariablesToApply ? JSON.parse(JSON.stringify(sourceCssVariables)) : {};
  if (!DomDocumentHelper.isAvailable()) return clonedCssVariables;
  const host = rootElement || DomDocumentHelper.getBody() || DomDocumentHelper.getDocumentElement();
  if (!host) return clonedCssVariables;

  const tempElement = createCssVariableProbeElement(host);
  if (!tempElement) return clonedCssVariables;
  if (hasCssVariablesToApply) {
    DomDocumentHelper.setStyles(tempElement, sourceCssVariables);
    tempElement.classList.add(THEME_ROOT_CLASS);
  }

  const result: { [key: string]: string } = {};
  try {
    const probeComputed = DomDocumentHelper.getComputedStyle(tempElement);
    const varNames = [...Object.keys(sourceCssVariables), ...additionalCssVariables];
    for (const varName of varNames) {
      const sourceValue = sourceCssVariables[varName];
      const proxyProperty = getCssVariableProxyProperty(varName);
      let value: string;
      if (proxyProperty === null) {
        value = probeComputed.getPropertyValue(varName).trim();
      } else {
        tempElement.style.setProperty(proxyProperty, `var(${varName})`);
        const raw = probeComputed.getPropertyValue(proxyProperty);
        value = normalizeCssVariableValue(raw, proxyProperty);
        tempElement.style.removeProperty(proxyProperty);
      }
      if (typeof value === "string" && value.trim() === "") {
        if (sourceValue !== undefined) {
          result[varName] = sourceValue;
        }
        continue;
      }
      result[varName] = value;
    }
  } finally {
    host.removeChild(tempElement);
  }
  return result;
}