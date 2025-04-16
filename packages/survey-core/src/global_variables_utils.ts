/* eslint-disable no-restricted-globals */
export class DomWindowHelper {
  public static isAvailable(): boolean {
    return "undefined" !== typeof window;
  }
  public static isFileReaderAvailable(): boolean {
    if (!DomWindowHelper.isAvailable()) return false;
    return !!(<any>window)["FileReader"];
  }
  public static getLocation(): Location {
    if (!DomWindowHelper.isAvailable()) return;
    return window.location;
  }
  public static getVisualViewport(): VisualViewport | null {
    if (!DomWindowHelper.isAvailable()) return null;
    return window.visualViewport;
  }
  public static getInnerWidth(): number {
    if (!DomWindowHelper.isAvailable()) return;
    return window.innerWidth;
  }
  public static getInnerHeight(): number {
    if (!DomWindowHelper.isAvailable()) return null;
    return window.innerHeight;
  }
  public static getDevicePixelRatio(): number {
    if (!DomWindowHelper.isAvailable()) return null;
    return window.devicePixelRatio;
  }
  public static getWindow(): Window {
    if (!DomWindowHelper.isAvailable()) return;
    return window;
  }
  public static hasOwn(propertyName: string): boolean {
    if (!DomWindowHelper.isAvailable()) return;
    return propertyName in window;
  }
  public static getSelection(): Selection | null {
    if (DomWindowHelper.isAvailable() && window.getSelection) {
      return window.getSelection();
    }
  }
  public static requestAnimationFrame(callback: FrameRequestCallback): number {
    if (DomWindowHelper.isAvailable()) {
      return window.requestAnimationFrame(callback);
    }
  }
  public static addEventListener(type: string, listener: (e?: any) => void): void {
    if (!DomWindowHelper.isAvailable()) return;
    window.addEventListener(type, listener);
  }
  public static removeEventListener(type: string, listener: (e?: any) => void): void {
    if (!DomWindowHelper.isAvailable()) return;
    window.removeEventListener(type, listener);
  }

  public static matchMedia(mediaQueryString: string): {matches:boolean} | null {
    if (!DomWindowHelper.isAvailable() || typeof window.matchMedia === "undefined") return null;
    return window.matchMedia(mediaQueryString);
  }
}

export class DomDocumentHelper {
  public static isAvailable(): boolean {
    return "undefined" !== typeof document;
  }
  public static getBody(): HTMLElement {
    if (!DomDocumentHelper.isAvailable()) return;
    return document.body;
  }
  public static getDocumentElement(): HTMLElement {
    if (!DomDocumentHelper.isAvailable()) return;
    return document.documentElement;
  }
  public static getDocument(): Document {
    if (!DomDocumentHelper.isAvailable()) return;
    return document;
  }
  public static getCookie(): string {
    if (!DomDocumentHelper.isAvailable()) return;
    return document.cookie;
  }
  public static setCookie(newCookie: string): void {
    if (!DomDocumentHelper.isAvailable()) return;
    document.cookie = newCookie;
  }
  public static activeElementBlur(): Document {
    if (!DomDocumentHelper.isAvailable()) return;

    const activeElement = document.activeElement;
    if (!!activeElement && !!(<any>activeElement).blur) {
      (<any>activeElement).blur();
    }
  }
  public static createElement(tagName: string): HTMLElement {
    if (!DomDocumentHelper.isAvailable()) return;
    return document.createElement(tagName);
  }
  public static getComputedStyle(elt: Element): CSSStyleDeclaration {
    if (!DomDocumentHelper.isAvailable()) return new CSSStyleDeclaration();
    return document.defaultView.getComputedStyle(elt);
  }
  public static addEventListener(type: string, listener: (e?: any) => void): void {
    if (!DomDocumentHelper.isAvailable()) return;
    document.addEventListener(type, listener);
  }
  public static removeEventListener(type: string, listener: (e?: any) => void): void {
    if (!DomDocumentHelper.isAvailable()) return;
    document.removeEventListener(type, listener);
  }
}