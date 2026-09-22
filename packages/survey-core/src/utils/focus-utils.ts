import { settings } from "../settings";
import { DomDocumentHelper } from "../global_variables_utils";
import { getClosestSurveyScroller, revealElementHorizontally, scrollElementIntoScroller } from "./scroll-utils";

export type FocusElementTarget = string | (() => HTMLElement);

export interface IFocusElementOptions {
  containerEl?: HTMLElement;
  // The survey positions the focused question itself (autoCenterFocusedQuestion),
  // so native focus scrolling is suppressed.
  scrollIntoScroller?: boolean;
  // Brings the element into the window when scrollIntoScroller is off. SurveyElement passes
  // its public static ScrollElementToViewCore here so overrides of that entry point still apply.
  scrollIntoView?: (el: HTMLElement) => void;
}

export function findFocusElement(target: FocusElementTarget, containerEl?: HTMLElement): HTMLElement {
  const { root } = settings.environment;
  if (!root && !containerEl) return null;
  if (typeof target == "string") {
    return containerEl ? containerEl.querySelector(`#${CSS.escape(target)}`) : root.getElementById(target);
  }
  return target();
}

// https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
export function canFocusElement(el: HTMLElement): boolean {
  return !!el && !(<any>el)["disabled"] && el.style.display !== "none" && el.offsetParent !== null;
}

export function getFocusOptions(preventScroll: boolean): FocusOptions {
  // Keep the keyboard focus ring so :focus-visible styles apply (radio, checkbox, boolean, image picker).
  const res: any = { focusVisible: true };
  if (preventScroll) {
    res.preventScroll = true;
  }
  return res;
}

export function focusElementCore(target: FocusElementTarget, options: IFocusElementOptions = {}): boolean {
  const el = findFocusElement(target, options.containerEl);
  if (!canFocusElement(el)) return false;
  if (options.scrollIntoScroller) {
    // Native focus scrolling fights the centering animation; preventScroll lets the
    // survey move the focused question itself.
    const scroller = getClosestSurveyScroller(el);
    if (scroller) {
      scrollElementIntoScroller(el, scroller);
    }
    // preventScroll also switches off the native horizontal reveal, e.g. of a matrix cell
    // outside the visible part of its horizontally scrolling table.
    revealElementHorizontally(el);
    el.focus(getFocusOptions(true));
  } else {
    options.scrollIntoView && options.scrollIntoView(el);
    el.focus(getFocusOptions(false));
  }
  return true;
}

// Returns whether the element was focused immediately. On failure (or when isTimeOut is set)
// one more attempt runs after a delay, for elements that are not rendered yet.
export function focusElement(target: FocusElementTarget, isTimeOut: boolean, options: IFocusElementOptions = {}): boolean {
  if (!target || !DomDocumentHelper.isAvailable()) return false;
  const res: boolean = !isTimeOut ? focusElementCore(target, options) : false;
  if (!res) {
    setTimeout(() => {
      focusElementCore(target, options);
    }, isTimeOut ? 100 : 10);
  }
  return res;
}
