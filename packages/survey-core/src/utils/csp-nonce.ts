import { settings } from "../settings";
import { DomDocumentHelper } from "../global_variables_utils";

// Lives here rather than in global_variables_utils.ts: settings.ts imports that module,
// so reading settings from it would introduce an import cycle.

let detectedNonce: string | undefined;
let detectionDone = false;

function readNonce(el: any): string {
  // The IDL property keeps the real value after the browser hides the content
  // attribute; getAttribute is the fallback for jsdom and older engines.
  return (!!el && (el.nonce || el.getAttribute?.("nonce"))) || "";
}

// Captured at module evaluation time: for classic scripts document.currentScript
// carries the page nonce, and it is null by the time anything else runs.
(function captureCurrentScriptNonce(): void {
  const doc = DomDocumentHelper.getDocument();
  const nonce = readNonce(doc && (<any>doc).currentScript);
  if (!!nonce) {
    detectedNonce = nonce;
    detectionDone = true;
  }
})();

// Limitation: the first nonce found wins, and a script usually comes first - when a
// page uses different nonces for script-src and style-src, the detected one may not
// satisfy style-src. Such pages should set settings.cspNonce explicitly.
function detectNonceFromDom(): string {
  const doc = DomDocumentHelper.getDocument();
  if (!doc) return "";
  const nonce = readNonce((<any>doc).currentScript);
  if (!!nonce) return nonce;
  const elements = doc.querySelectorAll("script,style,link[rel='stylesheet']");
  for (let i = 0; i < elements.length; i++) {
    const value = readNonce(elements[i]);
    if (!!value) return value;
  }
  return "";
}

export function getStylesNonce(): string {
  // An explicit setting always wins, including "" to disable nonce emission.
  if (settings.cspNonce !== undefined) return settings.cspNonce;
  if (!detectionDone) {
    detectedNonce = detectNonceFromDom();
    detectionDone = true;
  }
  return detectedNonce || "";
}

export function resetStylesNonceCache(): void {
  detectedNonce = undefined;
  detectionDone = false;
}

export function applyNonceToElement(element?: HTMLElement): void {
  const nonce = getStylesNonce();
  if (!element || !nonce) return;
  if ("nonce" in element) {
    // The IDL property is what CSP matches against. Never writing the content
    // attribute keeps the nonce out of reach of CSS attribute selectors even on
    // pages with a <meta>-delivered CSP, where the browser's own nonce hiding
    // (which empties the attribute on insertion) does not kick in.
    (<any>element).nonce = nonce;
  } else {
    // jsdom and older engines: no IDL support, the attribute is all there is.
    element.setAttribute("nonce", nonce);
  }
}

export function createStyleElement(cssText?: string): HTMLStyleElement | null {
  const element = DomDocumentHelper.createElement("style") as HTMLStyleElement;
  if (!element) return null;
  applyNonceToElement(element);
  if (cssText !== undefined) {
    element.textContent = cssText;
  }
  return element;
}
