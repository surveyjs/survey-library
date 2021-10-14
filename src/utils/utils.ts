import { settings } from "./../settings";
function compareVersions(a: any, b: any) {
  const regExStrip0: RegExp = /(\.0+)+$/;
  const segmentsA: string[] = a.replace(regExStrip0, "").split(".");
  const segmentsB: string[] = b.replace(regExStrip0, "").split(".");
  const len: number = Math.min(segmentsA.length, segmentsB.length);
  for (let i: number = 0; i < len; i++) {
    const diff: number =
      parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
    if (diff) {
      return diff;
    }
  }
  return segmentsA.length - segmentsB.length;
}
function confirmAction(message: string): boolean {
  if (!!settings && !!settings.confirmActionFunc)
    return settings.confirmActionFunc(message);
  return confirm(message);
}
function detectIEBrowser() {
  if (typeof window === "undefined") return false;
  const ua: string = window.navigator.userAgent;
  const oldIe: number = ua.indexOf("MSIE ");
  const elevenIe: number = ua.indexOf("Trident/");
  return oldIe > -1 || elevenIe > -1;
}
function detectIEOrEdge() {
  if (typeof window === "undefined") return false;
  if (typeof (<any>detectIEOrEdge).isIEOrEdge === "undefined") {
    const ua: string = window.navigator.userAgent;
    const msie: number = ua.indexOf("MSIE ");
    const trident: number = ua.indexOf("Trident/");
    const edge: number = ua.indexOf("Edge/");
    (<any>detectIEOrEdge).isIEOrEdge = edge > 0 || trident > 0 || msie > 0;
  }
  return (<any>detectIEOrEdge).isIEOrEdge;
}
function loadFileFromBase64(b64Data: string, fileName: string) {
  try {
    const byteString: string = atob(b64Data.split(",")[1]);

    // separate out the mime component
    const mimeString: string = b64Data
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];

    // write the bytes of the string to an ArrayBuffer
    const ab: ArrayBuffer = new ArrayBuffer(byteString.length);
    const ia: Uint8Array = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    // write the ArrayBuffer to a blob, and you're done
    const bb: Blob = new Blob([ab], { type: mimeString });
    if (
      typeof window !== "undefined" &&
      window.navigator &&
      (<any>window.navigator)["msSaveBlob"]
    ) {
      (<any>window.navigator)["msSaveOrOpenBlob"](bb, fileName);
    }
  } catch (err) { }
}
function isMobile() {
  return (
    typeof window !== "undefined" && typeof window.orientation !== "undefined"
  );
}

function isElementVisible(
  element: HTMLElement,
  threshold: number = 0
): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  const elementRect: DOMRect = element.getBoundingClientRect();
  const viewHeight: number = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  );
  const topWin: number = -threshold;
  const bottomWin: number = viewHeight + threshold;
  const topEl: number = elementRect.top;
  const bottomEl: number = elementRect.bottom;

  const maxTop: number = Math.max(topWin, topEl);
  const minBottom: number = Math.min(bottomWin, bottomEl);
  return maxTop <= minBottom;
}

function findScrollableParent(element: HTMLElement): HTMLElement {
  if (!element) {
    return document.documentElement;
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

  return findScrollableParent(element.parentElement);
}

function scrollElementByChildId(id: string) {
  if (!document) return;
  const el = document.getElementById(id);
  if (!el) return;
  const scrollableEl = findScrollableParent(el);
  if (!!scrollableEl) {
    scrollableEl.dispatchEvent(new CustomEvent("scroll"));
  }
}

function getIconNameFromProxy(iconName: string): string {
  if (!iconName) return iconName;
  var proxyName = (<any>settings.customIcons)[iconName];
  return !!proxyName ? proxyName : iconName;
}

function createSvg(
  size: number,
  width: number,
  height: number,
  iconName: string,
  svgElem: any
) {
  svgElem.style.width = (size || width || 16) + "px";
  svgElem.style.height = (size || height || 16) + "px";
  const node: any = svgElem.childNodes[0];
  const realIconName = getIconNameFromProxy(iconName);
  node.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    "#" + realIconName
  );
}

export function unwrap<T>(value: T | (() => T)): T {
  if (typeof value !== "function") {
    return value;
  } else {
    return (<() => T>value)();
  }
}

export function getSize(value: any) {
  if (typeof value === "number") {
    return "" + value + "px";
  }
  if (!!value && typeof value === "string" && value.length > 0) {
    const lastSymbol: string = value[value.length - 1];
    if ((lastSymbol >= "0" && lastSymbol <= "9") || lastSymbol == ".") {
      try {
        const num: number = parseFloat(value);
        return "" + num + "px";
      } catch { }
    }
  }
  return value;
}

function doKey2ClickUp(evt: KeyboardEvent, options = { processEsc: true }): void {
  if (!!evt.target && (<any>evt.target)["contentEditable"] === "true") {
    return;
  }
  const element: any = evt.target;
  if (!element) return;
  const char: number = evt.which || evt.keyCode;
  if (char === 13 || char === 32) {
    if (element.click) element.click();
  } else if (options.processEsc && char === 27) {
    if (element.blur) element.blur();
  }
}
function doKey2ClickDown(evt: KeyboardEvent, options = { processEsc: true }): void {
  if (!!evt.target && (<any>evt.target)["contentEditable"] === "true") {
    return;
  }
  var char = evt.which || evt.keyCode;
  const supportedCodes = [13, 32];
  if (options.processEsc) {
    supportedCodes.push(27);
  }
  if (supportedCodes.indexOf(char) !== -1) {
    evt.preventDefault();
  }
}
function increaseHeightByContent(element: HTMLElement, getComputedStyle?: (elt: Element) => any) {
  if (!element) return;
  if (!getComputedStyle) getComputedStyle = (elt: Element) => { return window.getComputedStyle(elt); };

  const style = getComputedStyle(element);
  element.style.height = "auto";
  element.style.height = (element.scrollHeight + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)) + "px";
}
function getOriginalEvent(event: any) {
  return event.originalEvent || event;
}
function preventDefaults(event: any) {
  event.preventDefault();
  event.stopPropagation();
}

export {
  compareVersions,
  confirmAction,
  detectIEOrEdge,
  detectIEBrowser,
  loadFileFromBase64,
  isMobile,
  isElementVisible,
  findScrollableParent,
  scrollElementByChildId,
  createSvg,
  doKey2ClickUp,
  doKey2ClickDown,
  getIconNameFromProxy,
  increaseHeightByContent,
  getOriginalEvent,
  preventDefaults
};
