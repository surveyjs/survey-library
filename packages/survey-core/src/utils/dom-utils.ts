import { settings, ISurveyEnvironment } from "../settings";
import { DomDocumentHelper, DomWindowHelper } from "../global_variables_utils";
import { mergeValues } from "./utils";

export const isShadowDOM = (rootElement: Document | ShadowRoot | HTMLElement): rootElement is ShadowRoot => {
  return !!rootElement && !!("host" in rootElement && rootElement.host);
};

export const getElement = (element: HTMLElement | string): HTMLElement => {
  const { root }: ISurveyEnvironment = settings.environment;
  return typeof element === "string" ? root.getElementById(element) : element;
};

export function getRootNode(node: Element): Document | ShadowRoot | null {
  const root = node?.getRootNode() || settings.environment.root;
  if (!(root instanceof Document || root instanceof ShadowRoot)) return null;
  return root;
}

export function getActiveElement(): Element | null {
  const doc = DomDocumentHelper.getDocument();
  if (!doc) return null;
  let activeElement = doc.activeElement;
  if (activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement) {
    activeElement = activeElement.shadowRoot.activeElement;
  }
  return activeElement;
}

export function isElementVisible(
  element: HTMLElement,
  threshold: number = 0
): boolean {
  const root = getRootNode(element);
  if (!root || !element.offsetHeight) return false;

  const clientHeight = isShadowDOM(root)
    ? root.host.clientHeight
    : root.documentElement.clientHeight;
  const elementRect: DOMRect = element.getBoundingClientRect();
  const viewHeight: number = Math.max(
    clientHeight,
    DomWindowHelper.getInnerHeight()
  );
  const topWin: number = -threshold;
  const bottomWin: number = viewHeight + threshold;
  const topEl: number = elementRect.top;
  const bottomEl: number = elementRect.bottom;

  const maxTop: number = Math.max(topWin, topEl);
  const minBottom: number = Math.min(bottomWin, bottomEl);
  return maxTop <= minBottom;
}

export function findScrollableParent(element: Element): Element {
  if (!element) {
    return DomDocumentHelper.isAvailable() ? DomDocumentHelper.getDocument().documentElement : undefined;
  }
  if (
    element.scrollHeight > element.clientHeight &&
    (getComputedStyle(element).overflowY === "scroll" ||
      getComputedStyle(element).overflowY === "auto")
  ) {
    return element;
  }

  if (
    element.scrollWidth > element.clientWidth &&
    (getComputedStyle(element).overflowX === "scroll" ||
      getComputedStyle(element).overflowX === "auto")
  ) {
    return element;
  }
  if (!element.parentElement) {

    const rootNode = getRootNode(<HTMLElement>element);
    if (rootNode) {
      return isShadowDOM(rootNode) ? rootNode.host : rootNode.documentElement;
    }
  }
  return findScrollableParent(element.parentElement);
}

export function activateLazyRenderingChecks(element: Element): void {
  if (!element) return;
  const scrollableEl = findScrollableParent(element);
  if (!!scrollableEl) {
    setTimeout(() => scrollableEl.dispatchEvent(new CustomEvent("scroll")), 10);
  }
}

export function classesToSelector(str: string): string {
  if (!str) return str;
  const re = /\s*?([\w-]+)\s*?/g;
  return str.replace(re, ".$1");
}

export function getElementWidth(el: HTMLElement) {
  return !!getComputedStyle ? Number.parseFloat(getComputedStyle(el).width) : el.offsetWidth;
}

export function isContainerVisible(el: HTMLElement) {
  return !!(
    el.offsetWidth ||
    el.offsetHeight ||
    el.getClientRects().length
  );
}

export function getFirstVisibleChild(el: HTMLElement) {
  let result;
  for (let index = 0; index < el.children.length; index++) {
    if (!result && getComputedStyle(el.children[index]).display !== "none") {
      result = el.children[index];
    }
  }
  return result;
}

export function findParentByClassNames(element: HTMLElement, classNames: Array<string>): Element {
  if (!!element) {
    if (classNames.every(className => !className || element.classList.contains(className))) {
      return element;
    } else {
      return findParentByClassNames(element.parentElement, classNames);
    }
  }
}

export function getSafeUrl(url: string): string {
  if (!url) return url;
  if (url.toLocaleLowerCase().indexOf("javascript:") > -1) return encodeURIComponent(url);
  return url;
}

export function navigateToUrl(url: string): void {
  const location = DomWindowHelper.getLocation();
  if (!url || !location) return;
  location.href = getSafeUrl(url);
}

export function wrapUrlForBackgroundImage(url: string): string {
  return !!url ? ["url(", url, ")"].join("") : "";
}

export function isBase64URL(url: string): boolean {
  if (typeof url == "string") {
    return /^data:((?:\w+\/(?:(?!;).)+)?)((?:;[^;]+?)*),(.+)$/.test(url);
  }
  return null;
}

export function getOriginalEvent(event: any) {
  return event.originalEvent || event;
}

export function preventDefaults(event: any) {
  event.preventDefault();
  event.stopPropagation();
}

export function sanitizeEditableContent(element: any, cleanLineBreaks: boolean = true) {
  if (DomWindowHelper.isAvailable() && DomDocumentHelper.isAvailable() && element.childNodes.length > 0) {
    const selection = DomWindowHelper.getSelection();
    if (selection.rangeCount == 0) {
      return;
    }

    let range = selection.getRangeAt(0);
    range.setStart(range.endContainer, range.endOffset);
    range.setEndAfter(element.lastChild);
    selection.removeAllRanges();
    selection.addRange(range);
    let tail = selection.toString();
    let innerText = element.innerText;
    tail = tail.replace(/\r/g, "");
    if (cleanLineBreaks) {
      tail = tail.replace(/\n/g, "");
      innerText = innerText.replace(/\n/g, "");
    }
    const tail_len = tail.length;

    element.innerText = innerText;
    range = DomDocumentHelper.getDocument().createRange();

    range.setStart(element.firstChild, 0);
    range.setEnd(element.firstChild, 0);

    selection.removeAllRanges();
    selection.addRange(range);

    while(selection.toString().length < innerText.length - tail_len) {
      const selLen = selection.toString().length;
      (selection as any).modify("extend", "forward", "character");
      if (selection.toString().length == selLen) break;
    }
    range = selection.getRangeAt(0);
    range.setStart(range.endContainer, range.endOffset);
  }
}

export function updateListCssValues(res: any, css: any): void {
  const listCssClasses = {};
  mergeValues(css.list, listCssClasses);
  mergeValues(res.list, listCssClasses);
  res["list"] = listCssClasses;
}
