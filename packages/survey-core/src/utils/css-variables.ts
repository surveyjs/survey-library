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

export function getComputedCssVariableValue(varName: string, element?: HTMLElement): string {
  const el = element || DomDocumentHelper.getBody() || DomDocumentHelper.getDocumentElement();
  if (!el) return "";

  const computedStyle = DomDocumentHelper.getComputedStyle(el);
  if (!computedStyle || !computedStyle.getPropertyValue) return "";

  const value = computedStyle.getPropertyValue(varName);
  const proxyProperty = getCssVariableProxyProperty(varName);
  return normalizeCssVariableValue(value, proxyProperty);
}

function resolveComputedCssVariableValue(
  probe: HTMLElement,
  computed: CSSStyleDeclaration,
  varName: string
): string {
  const rawValue = computed.getPropertyValue(varName);
  if (typeof rawValue !== "string" || rawValue.trim() === "") return "";
  const proxyProperty = getCssVariableProxyProperty(varName);
  if (proxyProperty === null) return rawValue.trim();

  probe.style.setProperty(proxyProperty, `var(${varName})`);
  const raw = computed.getPropertyValue(proxyProperty);
  probe.style.removeProperty(proxyProperty);
  const proxyValue = normalizeCssVariableValue(raw, proxyProperty);

  return typeof proxyValue === "string" ? proxyValue.trim() : "";
}

export function getComputedCssVariableValues(
  sourceCssVariables: { [key: string]: string } = {},
  additionalCssVariables: string[] = [],
  rootElement?: HTMLElement
): { [key: string]: string } {
  const fallbackResult = { ...sourceCssVariables };
  if (!DomDocumentHelper.isAvailable()) return fallbackResult;

  const host = rootElement || DomDocumentHelper.getBody() || DomDocumentHelper.getDocumentElement();
  const probe = host ? createCssVariableProbeElement(host) : null;
  if (!probe) return fallbackResult;

  if (Object.keys(sourceCssVariables).length !== 0) {
    DomDocumentHelper.setStyles(probe, sourceCssVariables);
    probe.classList.add(THEME_ROOT_CLASS);
  }

  const result: { [key: string]: string } = {};
  try {
    const computed = DomDocumentHelper.getComputedStyle(probe);
    const varNames = [...Object.keys(sourceCssVariables), ...additionalCssVariables];
    for (const varName of varNames) {
      const value = resolveComputedCssVariableValue(probe, computed, varName);
      if (value !== "") {
        result[varName] = value;
      } else if (sourceCssVariables[varName] !== undefined) {
        result[varName] = sourceCssVariables[varName];
      }
    }
  } finally {
    host.removeChild(probe);
  }
  return result;
}