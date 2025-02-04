import { LocalizableString } from "../localizablestring";
import { settings, ISurveyEnvironment } from "./../settings";
import { IDialogOptions } from "../popup";
import { getLocaleString } from "../surveyStrings";
import { PopupBaseViewModel } from "../popup-view-model";
import { DomDocumentHelper, DomWindowHelper } from "../global_variables_utils";

function compareVersions(a: any, b: any): number {
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

function confirmActionAsync(options: IConfirmDialogOptions): void {
  const callbackFunc = (res: boolean): void => {
    if (res) options.funcOnYes();
    else if (!!options.funcOnNo) options.funcOnNo();
  };

  if (!!settings && !!settings.confirmActionAsync) {
    if (settings.confirmActionAsync(options.message, callbackFunc, options)) return;
  }

  callbackFunc(confirmAction(options.message));
}
function detectIEBrowser(): boolean {
  const ua: string = navigator.userAgent;
  const oldIe: number = ua.indexOf("MSIE ");
  const elevenIe: number = ua.indexOf("Trident/");
  return oldIe > -1 || elevenIe > -1;
}
function detectIEOrEdge(): boolean {
  if (typeof (<any>detectIEOrEdge).isIEOrEdge === "undefined") {
    const ua: string = navigator.userAgent;
    const msie: number = ua.indexOf("MSIE ");
    const trident: number = ua.indexOf("Trident/");
    const edge: number = ua.indexOf("Edge/");
    (<any>detectIEOrEdge).isIEOrEdge = edge > 0 || trident > 0 || msie > 0;
  }
  return (<any>detectIEOrEdge).isIEOrEdge;
}
function loadFileFromBase64(b64Data: string, fileName: string): void {
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
    if (!!navigator && (<any>navigator)["msSaveBlob"]) {
      (<any>navigator)["msSaveOrOpenBlob"](bb, fileName);
    }
  } catch (err) { }
}
function isMobile(): boolean {
  return (DomWindowHelper.isAvailable() && DomWindowHelper.hasOwn("orientation"));
}

const isShadowDOM = (rootElement: Document | ShadowRoot | HTMLElement): rootElement is ShadowRoot => {
  return !!rootElement && !!("host" in rootElement && rootElement.host);
};

const getElement = (element: HTMLElement | string): HTMLElement => {
  const { root }: ISurveyEnvironment = settings.environment;
  return typeof element === "string" ? root.getElementById(element) : element;
};

function isElementVisible(
  element: HTMLElement,
  threshold: number = 0
): boolean {
  if (typeof settings.environment === "undefined") {
    return false;
  }

  const { root }: ISurveyEnvironment = settings.environment;
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

function findScrollableParent(element: HTMLElement): HTMLElement {
  const { root }: ISurveyEnvironment = settings.environment;
  if (!element) {
    return isShadowDOM(root)
      ? root.host as HTMLElement
      : root.documentElement;
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

function activateLazyRenderingChecks(id: string): void {
  const environment: ISurveyEnvironment = settings.environment;
  if (!environment) return;
  const { root } = environment;
  const el = root.getElementById(id);
  if (!el) return;
  const scrollableEl = findScrollableParent(el);
  if (!!scrollableEl) {
    setTimeout(() => scrollableEl.dispatchEvent(new CustomEvent("scroll")), 10);
  }
}

function navigateToUrl(url: string): void {
  const location = DomWindowHelper.getLocation();
  if (!url || !location) return;
  location.href = getSafeUrl(url);
}

function wrapUrlForBackgroundImage(url: string): string {
  return !!url ? ["url(", url, ")"].join("") : "";
}
function isBase64URL(url: string): boolean {
  if (typeof url == "string") {
    return /^data:((?:\w+\/(?:(?!;).)+)?)((?:;[^;]+?)*),(.+)$/.test(url);
  }
  return null;
}

// old-name: new-name
const renamedIcons: any = {
  "changecamera": "flip-24x24",
  "clear": "clear-24x24",
  "cancel": "cancel-24x24",
  "closecamera": "close-24x24",
  "defaultfile": "file-72x72",
  "choosefile": "folder-24x24",
  "file": "toolbox-file-24x24",
  "left": "chevronleft-16x16",
  "modernbooleancheckchecked": "plus-32x32",
  "modernbooleancheckunchecked": "minus-32x32",
  "more": "more-24x24",
  "navmenu_24x24": "navmenu-24x24",
  "removefile": "error-24x24",
  "takepicture": "camera-32x32",
  "takepicture_24x24": "camera-24x24",
  "v2check": "check-16x16",
  "checked": "check-16x16",
  "v2check_24x24": "check-24x24",
  "back-to-panel_16x16": "restoredown-16x16",
  "clear_16x16": "clear-16x16",
  "close_16x16": "close-16x16",
  "collapsedetail": "collapsedetails-16x16",
  "expanddetail": "expanddetails-16x16",
  "full-screen_16x16": "maximize-16x16",
  "loading": "loading-48x48",
  "minimize_16x16": "minimize-16x16",
  "next_16x16": "chevronright-16x16",
  "previous_16x16": "chevronleft-16x16",
  "no-image": "noimage-48x48",
  "ranking-dash": "rankingundefined-16x16",
  "drag-n-drop": "drag-24x24",
  "ranking-arrows": "reorder-24x24",
  "restore_16x16": "fullsize-16x16",
  "reset": "restore-24x24",
  "search": "search-24x24",
  "average": "smiley-rate5-24x24",
  "excellent": "smiley-rate9-24x24",
  "good": "smiley-rate7-24x24",
  "normal": "smiley-rate6-24x24",
  "not-good": "smiley-rate4-24x24",
  "perfect": "smiley-rate10-24x24",
  "poor": "smiley-rate3-24x24",
  "terrible": "smiley-rate1-24x24",
  "very-good": "smiley-rate8-24x24",
  "very-poor": "smiley-rate2-24x24",
  "add_16x16": "add-16x16",
  "add_24x24": "add-24x24",
  "alert_24x24": "warning-24x24",
  "apply": "apply-24x24",
  "arrow-down": "arrowdown-24x24",
  "arrow-left": "arrowleft-24x24",
  "arrow-left_16x16": "arrowleft-16x16",
  "arrowleft": "arrowleft-16x16",
  "arrow-right": "arrowright-24x24",
  "arrow-right_16x16": "arrowright-16x16",
  "arrowright": "arrowright-16x16",
  "arrow-up": "arrowup-24x24",
  "boolean": "toolbox-boolean-24x24",
  "change-question-type_16x16": "speechbubble-16x16",
  "checkbox": "toolbox-checkbox-24x24",
  "collapse-detail_16x16": "minusbox-16x16",
  "collapse-panel": "collapse-pg-24x24",
  "collapse_16x16": "collapse-16x16",
  "color-picker": "dropper-16x16",
  "comment": "toolbox-longtext-24x24",
  "config": "wrench-24x24",
  "copy": "copy-24x24",
  "default": "toolbox-customquestion-24x24",
  "delete_16x16": "delete-16x16",
  "delete_24x24": "delete-24x24",
  "delete": "delete-24x24",
  "description-hide": "hidehint-16x16",
  "description": "hint-16x16",
  "device-desktop": "desktop-24x24",
  "device-phone": "phone-24x24",
  "device-rotate": "rotate-24x24",
  "device-tablet": "tablet-24x24",
  "download": "download-24x24",
  "drag-area-indicator": "drag-24x24",
  "drag-area-indicator_24x16": "draghorizontal-24x16",
  "v2dragelement_16x16": "draghorizontal-24x16",
  "drop-down-arrow": "chevrondown-24x24",
  "drop-down-arrow_16x16": "chevrondown-16x16",
  "chevron_16x16": "chevrondown-16x16",
  "dropdown": "toolbox-dropdown-24x24",
  "duplicate_16x16": "copy-16x16",
  "edit": "edit-24x24",
  "edit_16x16": "edit-16x16",
  "editing-finish": "finishedit-24x24",
  "error": "error-16x16",
  "expand-detail_16x16": "plusbox-16x16",
  "expand-panel": "expand-pg-24x24",
  "expand_16x16": "expand-16x16",
  "expression": "toolbox-expression-24x24",
  "fast-entry": "textedit-24x24",
  "fix": "fix-24x24",
  "html": "toolbox-html-24x24",
  "image": "toolbox-image-24x24",
  "imagepicker": "toolbox-imagepicker-24x24",
  "import": "import-24x24",
  "invisible-items": "invisible-24x24",
  "language": "language-24x24",
  "load": "import-24x24",
  "logic-collapse": "collapse-24x24",
  "logic-expand": "expand-24x24",
  "logo": "image-48x48",
  "matrix": "toolbox-matrix-24x24",
  "matrixdropdown": "toolbox-multimatrix-24x24",
  "matrixdynamic": "toolbox-dynamicmatrix-24x24",
  "multipletext": "toolbox-multipletext-24x24",
  "panel": "toolbox-panel-24x24",
  "paneldynamic": "toolbox-dynamicpanel-24x24",
  "preview": "preview-24x24",
  "radiogroup": "toolbox-radiogroup-24x24",
  "ranking": "toolbox-ranking-24x24",
  "rating": "toolbox-rating-24x24",
  "redo": "redo-24x24",
  "remove_16x16": "remove-16x16",
  "required": "required-16x16",
  "save": "save-24x24",
  "select-page": "selectpage-24x24",
  "settings": "settings-24x24",
  "settings_16x16": "settings-16x16",
  "signaturepad": "toolbox-signature-24x24",
  "switch-active_16x16": "switchon-16x16",
  "switch-inactive_16x16": "switchoff-16x16",
  "tagbox": "toolbox-tagbox-24x24",
  "text": "toolbox-singleline-24x24",
  "theme": "theme-24x24",
  "toolbox": "toolbox-24x24",
  "undo": "undo-24x24",
  "visible": "visible-24x24",
  "wizard": "wand-24x24",
  "searchclear": "clear-16x16",
  "chevron-16x16": "chevrondown-16x16",
  "chevron": "chevrondown-24x24",
  "progressbuttonv2": "arrowleft-16x16",
  "right": "chevronright-16x16",
  "add-lg": "add-24x24",
  "add": "add-24x24",
};

function getIconNameFromProxy(iconName: string): string {
  const customIconName = getCustomNewIconNameIfExists(iconName);
  return customIconName || getNewIconName(iconName);
}

export function getNewIconName(iconName: string): string {
  const prefix = "icon-";
  const nameWithoutPrefix = iconName.replace(prefix, "");
  const result = renamedIcons[nameWithoutPrefix] || nameWithoutPrefix;
  return prefix + result;
}

export function getCustomNewIconNameIfExists(iconName: string): string {
  // only for settings.customIcons["icon-import"] = "icon-export"; feature
  let result = (<any>settings.customIcons)[iconName];
  if (result) return getNewIconName(result);

  iconName = getNewIconName(iconName);
  result = (<any>settings.customIcons)[iconName];
  if (result) return result;

  return null;
}

function createSvg(
  size: number | string,
  width: number,
  height: number,
  iconName: string,
  svgElem: any,
  title: string,
): void {
  if (!svgElem) return;
  if (size !== "auto") {
    svgElem.style.width = (size || width || 16) + "px";
    svgElem.style.height = (size || height || 16) + "px";
  }
  const node: any = svgElem.childNodes[0];
  const realIconName = getIconNameFromProxy(iconName);
  node.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    "#" + realIconName
  );

  let titleElement = svgElem.getElementsByTagName("title")[0];
  if (!title) {
    if (!!titleElement) {
      svgElem.removeChild(titleElement);
    }
    return;
  } else {
    if (!titleElement) {
      titleElement = DomDocumentHelper.getDocument().createElementNS("http://www.w3.org/2000/svg", "title");
      svgElem.appendChild(titleElement);
    }
  }
  titleElement.textContent = title;
}
export function getSafeUrl(url: string): string {
  if (!url) return url;
  if (url.toLocaleLowerCase().indexOf("javascript:") > -1) return encodeURIComponent(url);
  return url;
}

export function unwrap<T>(value: T | (() => T)): T {
  if (typeof value !== "function") {
    return value;
  } else {
    return (<() => T>value)();
  }
}

// export function getSize(value: any): number {
//   if (typeof value === "number") {
//     return value;
//   }
//   if (typeof value === "string" && value.includes("px")) {
//     return parseInt(value);
//   }
//   if (!!value && typeof value === "string" && value.length > 0) {
//     const lastSymbol: string = value[value.length - 1];
//     if ((lastSymbol >= "0" && lastSymbol <= "9") || lastSymbol == ".") {
//       try {
//         const num: number = parseInt(value);
//         return num;
//       } catch { }
//     }
//   }
//   return value;
// }

export function getRenderedSize(val: string | number): number {
  if (typeof val == "string") {
    if (!isNaN(Number(val))) {
      return Number(val);
    }
    else if (val.includes("px")) {
      return parseFloat(val);
    }
  }
  if (typeof val == "number") {
    return val;
  }
  return undefined;
}
export function getRenderedStyleSize(val: string | number): string {
  if (getRenderedSize(val) !== undefined) {
    return undefined;
  }
  return val as string;
}

export interface IAttachKey2clickOptions {
  processEsc?: boolean;
  disableTabStop?: boolean;
  __keyDownReceived?: boolean;
}
const keyFocusedClassName = "sv-focused--by-key";
export function doKey2ClickBlur(evt: KeyboardEvent): void {
  const element: any = evt.target;
  if (!element || !element.classList) return;
  element.classList.remove(keyFocusedClassName);
}

export function doKey2ClickUp(evt: KeyboardEvent, options?: IAttachKey2clickOptions): void {
  if (!!evt.target && (<any>evt.target)["contentEditable"] === "true") {
    return;
  }
  const element: any = evt.target;
  if (!element) return;
  const char: number = evt.which || evt.keyCode;
  if (char === 9) {
    if (!!element.classList && !element.classList.contains(keyFocusedClassName)) {
      element.classList.add(keyFocusedClassName);
    }
    return;
  }

  if (options) {
    if (!options.__keyDownReceived) return;
    options.__keyDownReceived = false;
  }

  if (char === 13 || char === 32) {
    if (element.click) element.click();
  } else if ((!options || options.processEsc) && char === 27) {
    if (element.blur) element.blur();
  }
}

export function doKey2ClickDown(evt: KeyboardEvent, options: IAttachKey2clickOptions = { processEsc: true }): void {
  if (options) options.__keyDownReceived = true;
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
  if (!getComputedStyle) getComputedStyle = (elt: Element) => { return DomDocumentHelper.getComputedStyle(elt); };

  const style = getComputedStyle(element);
  element.style.height = "auto";
  if (!!element.scrollHeight) {
    element.style.height = (element.scrollHeight + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)) + "px";
  }
}
function getOriginalEvent(event: any) {
  return event.originalEvent || event;
}
function preventDefaults(event: any) {
  event.preventDefault();
  event.stopPropagation();
}
function classesToSelector(str: string): string {
  if (!str) return str;
  const re = /\s*?([\w-]+)\s*?/g;
  return str.replace(re, ".$1");
}

function getElementWidth(el: HTMLElement) {
  return !!getComputedStyle ? Number.parseFloat(getComputedStyle(el).width) : el.offsetWidth;
}

function isContainerVisible(el: HTMLElement) {
  return !!(
    el.offsetWidth ||
    el.offsetHeight ||
    el.getClientRects().length
  );
}

function getFirstVisibleChild(el: HTMLElement) {
  let result;
  for (let index = 0; index < el.children.length; index++) {
    if (!result && getComputedStyle(el.children[index]).display !== "none") {
      result = el.children[index];
    }
  }
  return result;
}
function findParentByClassNames(element: HTMLElement, classNames: Array<string>): Element {
  if (!!element) {
    if (classNames.every(className => !className || element.classList.contains(className))) {
      return element;
    } else {
      return findParentByClassNames(element.parentElement, classNames);
    }
  }
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

    while (selection.toString().length < innerText.length - tail_len) {
      const selLen = selection.toString().length;
      (selection as any).modify("extend", "forward", "character");
      if (selection.toString().length == selLen) break;
    }
    range = selection.getRangeAt(0);
    range.setStart(range.endContainer, range.endOffset);
  }
}
function mergeValues(src: any, dest: any): void {
  if (!dest || !src) return;
  if (typeof dest !== "object") return;
  for (var key in src) {
    var value = src[key];
    if (!Array.isArray(value) && value && typeof value === "object") {
      if (!dest[key] || typeof dest[key] !== "object") dest[key] = {};
      mergeValues(value, dest[key]);
    } else {
      dest[key] = value;
    }
  }
}
function updateListCssValues(res: any, css: any): void {
  const listCssClasses = {};
  mergeValues(css.list, listCssClasses);
  mergeValues(res.list, listCssClasses);
  res["list"] = listCssClasses;
}

export class Logger {
  private _result = "";
  public log(action: string) {
    this._result += "->" + action;
  }
  public get result() {
    return this._result;
  }
}

export interface IConfirmDialogOptions {
  message?: string;
  funcOnYes?: () => void;
  funcOnNo?: () => void;
  applyTitle?: string;
  locale?: string;
  rootElement?: HTMLElement;
  cssClass?: string;
}
export function showConfirmDialog(message: string, callback: (res: boolean) => void, options: IConfirmDialogOptions): boolean {
  const locStr = new LocalizableString(undefined);
  const popupViewModel: PopupBaseViewModel = settings.showDialog(<IDialogOptions>{
    componentName: "sv-string-viewer",
    data: { locStr: locStr, locString: locStr, model: locStr }, //TODO fix in library
    onApply: () => {
      callback(true);
      return true;
    },
    onCancel: () => {
      callback(false);
      return false;
    },
    title: message || options.message,
    displayMode: "popup",
    isFocusedContent: false,
    cssClass: options.cssClass || "sv-popup--confirm"
  }, options.rootElement);
  const toolbar = popupViewModel.footerToolbar;
  const applyBtn = toolbar.getActionById("apply");
  const cancelBtn = toolbar.getActionById("cancel");
  cancelBtn.title = getLocaleString("cancel", options.locale);
  cancelBtn.innerCss = "sv-popup__body-footer-item sv-popup__button sd-btn sd-btn--small";
  applyBtn.title = options.applyTitle || getLocaleString("ok", options.locale);
  applyBtn.innerCss = "sv-popup__body-footer-item sv-popup__button sv-popup__button--danger sd-btn sd-btn--small sd-btn--danger";
  configConfirmDialog(popupViewModel);
  return true;
}

export function configConfirmDialog(popupViewModel: PopupBaseViewModel): void {
  popupViewModel.width = "min-content";
}

function chooseFiles(input: HTMLInputElement, callback: (files: File[]) => void): void {
  if (!DomWindowHelper.isFileReaderAvailable()) return;
  input.value = "";
  input.onchange = (event) => {
    if (!DomWindowHelper.isFileReaderAvailable()) return;
    if (!input || !input.files || input.files.length < 1) return;
    let files = [];
    for (let i = 0; i < input.files.length; i++) {
      files.push(input.files[i]);
    }
    callback(files);
  };
  input.click();
}
export function compareArrays<T>(oldValue: Array<T>, newValue: Array<T>, getKey: (item: T) => any): { addedItems: Array<T>, deletedItems: Array<T>, reorderedItems: Array<{ item: T, movedForward: boolean }>, mergedItems: Array<T> } {
  const oldItemsMap = new Map<any, T>();
  const newItemsMap = new Map<any, T>();
  const commonItemsInNewMap = new Map<any, number>();
  const commonItemsInOldMap = new Map<any, number>();
  oldValue.forEach((item) => {
    const itemKey = getKey(item);
    if (!oldItemsMap.has(itemKey)) {
      oldItemsMap.set(getKey(item), item);
    } else {
      //if keys are set incorrectly do not process comparing
      throw new Error("keys must be unique");
    }
  });
  newValue.forEach((item) => {
    const itemKey = getKey(item);
    if (!newItemsMap.has(itemKey)) {
      newItemsMap.set(itemKey, item);
    } else {
      //if keys are set incorrectly do not process comparing
      throw new Error("keys must be unique");
    }
  });
  const addedItems: Array<T> = [];
  const deletedItems: Array<T> = [];

  //calculating addedItems and items that exist in both arrays
  newItemsMap.forEach((item, key) => {
    if (!oldItemsMap.has(key)) {
      addedItems.push(item);
    } else {
      commonItemsInNewMap.set(key, commonItemsInNewMap.size);
    }
  });

  //calculating deletedItems and items that exist in both arrays

  oldItemsMap.forEach((item, key) => {
    if (!newItemsMap.has(key)) {
      deletedItems.push(item);
    } else {
      commonItemsInOldMap.set(key, commonItemsInOldMap.size);
    }
  });

  //calculating reordered items
  const reorderedItems: Array<{ item: T, movedForward: boolean }> = [];
  commonItemsInNewMap.forEach((index, key) => {
    const oldIndex = commonItemsInOldMap.get(key);
    const item = newItemsMap.get(key);
    if (oldIndex !== index) reorderedItems.push({ item: item, movedForward: oldIndex < index });
  });

  //calculating merged array if multiple operations are applied at once

  const oldItemsWithCorrectOrder = new Array<T>(oldValue.length);
  let commonItemsIndex = 0;
  const commonItemsKeysOrder = Array.from(commonItemsInNewMap.keys());
  oldValue.forEach((item, index) => {
    if (commonItemsInNewMap.has(getKey(item))) {
      oldItemsWithCorrectOrder[index] = newItemsMap.get(commonItemsKeysOrder[commonItemsIndex]);
      commonItemsIndex++;
    } else {
      oldItemsWithCorrectOrder[index] = item;
    }
  });

  const valuesToInsertBeforeKey = new Map<any, Array<T>>();
  let tempValuesArray: Array<T> = [];
  oldItemsWithCorrectOrder.forEach((item) => {
    const itemKey = getKey(item);
    if (newItemsMap.has(itemKey)) {
      if (tempValuesArray.length > 0) {
        valuesToInsertBeforeKey.set(itemKey, tempValuesArray);
        tempValuesArray = [];
      }
    } else {
      tempValuesArray.push(item);
    }
  });
  const mergedItems = new Array<T>();
  newItemsMap.forEach((item, key) => {
    if (valuesToInsertBeforeKey.has(key)) {
      valuesToInsertBeforeKey.get(key).forEach((item) => {
        mergedItems.push(item);
      });
    }
    mergedItems.push(item);
  });
  tempValuesArray.forEach((item) => {
    mergedItems.push(item);
  });
  return { reorderedItems, deletedItems, addedItems, mergedItems };
}

interface IVerticalDimensions {
  paddingTop: string;
  paddingBottom: string;
  marginTop: string;
  marginBottom: string;
  heightTo: string;
  borderTopWidth: string;
  borderBottomWidth: string;
  heightFrom: string;
}

export function getVerticalDimensions(el: HTMLElement): IVerticalDimensions {
  if (DomDocumentHelper.isAvailable()) {
    const { paddingTop, paddingBottom, borderTopWidth, borderBottomWidth, marginTop, marginBottom, boxSizing } = DomDocumentHelper.getComputedStyle(el);
    let heightTo = el.offsetHeight + "px";
    if (boxSizing == "content-box") {
      let heightPx = el.offsetHeight;
      [borderBottomWidth, borderTopWidth, paddingBottom, paddingTop].forEach((style) => {
        heightPx -= parseFloat(style);
      });
      heightTo = heightPx + "px";
    }
    return {
      paddingTop,
      paddingBottom,
      borderTopWidth,
      borderBottomWidth,
      marginTop,
      marginBottom,
      heightFrom: "0px",
      heightTo: heightTo
    };
  } else {
    return undefined;
  }
}

export function setPropertiesOnElementForAnimation(el: HTMLElement, styles: any, prefix: string = "--animation-"): void {
  (el as any)["__sv_created_properties"] = (el as any)["__sv_created_properties"] ?? [];
  Object.keys(styles).forEach((key) => {
    const propertyName = `${prefix}${key.split(/\.?(?=[A-Z])/).join("-").toLowerCase()}`;
    el.style.setProperty(propertyName, (styles as any)[key]);
    (el as any)["__sv_created_properties"].push(propertyName);
  });
}

export function prepareElementForVerticalAnimation(el: HTMLElement): void {
  setPropertiesOnElementForAnimation(el, getVerticalDimensions(el));
}

export function cleanHtmlElementAfterAnimation(el: HTMLElement): void {
  if (Array.isArray((el as any)["__sv_created_properties"])) {
    (el as any)["__sv_created_properties"].forEach((propertyName: string) => {
      el.style.removeProperty(propertyName);
    });
    delete (el as any)["__sv_created_properties"];
  }
}
export function floorTo2Decimals(number: number): number {
  return Math.floor(number * 100) / 100;
}

export {
  mergeValues,
  updateListCssValues,
  getElementWidth,
  isContainerVisible,
  classesToSelector,
  compareVersions,
  confirmAction,
  confirmActionAsync,
  detectIEOrEdge,
  detectIEBrowser,
  loadFileFromBase64,
  isMobile,
  isShadowDOM,
  getElement,
  isElementVisible,
  findScrollableParent,
  activateLazyRenderingChecks,
  navigateToUrl,
  wrapUrlForBackgroundImage,
  createSvg,
  getIconNameFromProxy,
  increaseHeightByContent,
  getOriginalEvent,
  preventDefaults,
  findParentByClassNames,
  getFirstVisibleChild,
  chooseFiles,
  isBase64URL,
  renamedIcons
};
