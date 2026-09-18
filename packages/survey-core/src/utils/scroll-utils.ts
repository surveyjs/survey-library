import { DomDocumentHelper, DomWindowHelper } from "../global_variables_utils";
import { findScrollableParent } from "./dom-utils";

function isNeedScrollIntoView(el: Element, checkLeft: boolean, scrollIfVisible?: boolean): boolean {
  const elTop: number = scrollIfVisible ? -1 : el.getBoundingClientRect().top;
  let needScroll = elTop < 0;
  let elLeft: number = -1;
  if (!needScroll && checkLeft) {
    elLeft = el.getBoundingClientRect().left;
    needScroll = elLeft < 0;
  }
  if (!needScroll && DomWindowHelper.isAvailable()) {
    const height = DomWindowHelper.getInnerHeight();
    needScroll = height > 0 && height < elTop;
    if (!needScroll && checkLeft) {
      const width = DomWindowHelper.getInnerWidth();
      needScroll = width > 0 && width < elLeft;
    }
  }
  return needScroll;
}

export function scrollIntoView(el: Element, scrollIntoViewOptions?: ScrollIntoViewOptions, doneCallback?: () => void): void {
  el.scrollIntoView(scrollIntoViewOptions);
  if (typeof doneCallback === "function") {
    let lastPos: number = null;
    let same: number = 0;
    const checkPos = () => {
      const newPos = el.getBoundingClientRect().top;
      if (newPos === lastPos) {
        if (same++ > 2) {
          doneCallback();
          return;
        }
      } else {
        lastPos = newPos;
        same = 0;
      }
      DomWindowHelper.requestAnimationFrame(checkPos);
    };
    DomWindowHelper.requestAnimationFrame(checkPos);
  }
}

export function scrollElementToViewCore(el: Element, checkLeft: boolean, scrollIfVisible?: boolean, scrollIntoViewOptions?: ScrollIntoViewOptions, doneCallback?: () => void): boolean {
  if (!el || !el.scrollIntoView) {
    doneCallback && doneCallback();
    return false;
  }
  const needScroll = isNeedScrollIntoView(el, checkLeft, scrollIfVisible);
  if (needScroll) {
    scrollIntoView(el, scrollIntoViewOptions, doneCallback);
  } else {
    doneCallback && doneCallback();
  }
  return needScroll;
}

export function getClosestSurveyScroller(el: HTMLElement): HTMLElement | null {
  if (!el || typeof el.closest !== "function") return null;
  return el.closest(".sv-scroll__scroller") as HTMLElement;
}

export function getScrollContainerForElement(el: HTMLElement): HTMLElement | null {
  if (!el) return null;
  const innerScroller = getClosestSurveyScroller(el);
  if (innerScroller) return innerScroller;
  let res = findScrollableParent(el.parentElement) as HTMLElement;
  // Inside a shadow root the lookup ends at the host whether it scrolls or not; a host that
  // does not scroll hands the search over to its own tree, up to the document.
  while(!!res && !!res.shadowRoot && !isVerticalScroller(res)) {
    res = findScrollableParent(res.parentElement) as HTMLElement;
  }
  return res || null;
}

function isVerticalScroller(el: HTMLElement): boolean {
  if (el.scrollHeight <= el.clientHeight) return false;
  const overflowY = DomDocumentHelper.getComputedStyle(el)?.overflowY;
  return overflowY === "auto" || overflowY === "scroll";
}

export function isDocumentScroller(scroller: HTMLElement): boolean {
  const doc = DomDocumentHelper.getDocument();
  const docEl = DomDocumentHelper.getDocumentElement();
  const body = DomDocumentHelper.getBody();
  return !!scroller && (scroller === docEl || scroller === body || (!!doc && scroller === doc.scrollingElement));
}

// The visible band of a scroller in viewport coordinates. A document scroller is visible through the window,
// so its own bounding rectangle (the whole page) does not describe what the user sees.
export function getScrollerViewport(scroller: HTMLElement): { top: number, height: number } {
  if (isDocumentScroller(scroller)) {
    return { top: 0, height: DomWindowHelper.getInnerHeight() || scroller.clientHeight };
  }
  const rect = scroller.getBoundingClientRect();
  return { top: rect.top, height: rect.height || (rect.bottom - rect.top) };
}

// How far a scroller has to move along one axis to bring the [elStart, elEnd] span into the [viewStart, viewEnd] band
// with the least movement. Zero when the span is already inside. A span longer than the band keeps its leading
// edge (the trailing one when alignEnd is set, e.g. the right edge in RTL) unless it already covers the whole band.
export function getNearestScrollDelta(elStart: number, elEnd: number, viewStart: number, viewEnd: number, alignEnd: boolean = false): number {
  if (elEnd - elStart > viewEnd - viewStart) {
    if (elStart <= viewStart && elEnd >= viewEnd) return 0;
    return alignEnd ? elEnd - viewEnd : elStart - viewStart;
  }
  if (elStart < viewStart) return elStart - viewStart;
  if (elEnd > viewEnd) return elEnd - viewEnd;
  return 0;
}

function getHorizontalViewport(scroller: HTMLElement): { left: number, right: number } {
  if (isDocumentScroller(scroller)) {
    const docEl = DomDocumentHelper.getDocumentElement();
    return { left: 0, right: (!!docEl && docEl.clientWidth) || DomWindowHelper.getInnerWidth() || 0 };
  }
  // clientLeft skips the border and, in RTL, a vertical scrollbar placed on the left.
  const left = scroller.getBoundingClientRect().left + scroller.clientLeft;
  return { left: left, right: left + scroller.clientWidth };
}

function isHorizontalScroller(el: HTMLElement): boolean {
  if (el.scrollWidth <= el.clientWidth) return false;
  if (isDocumentScroller(el)) return el === (DomDocumentHelper.getDocument()?.scrollingElement || DomDocumentHelper.getDocumentElement());
  const overflowX = DomDocumentHelper.getComputedStyle(el)?.overflowX;
  // A hidden overflow cannot be scrolled by the user, but it still clips and native focus scrolls it too.
  return overflowX === "auto" || overflowX === "scroll" || overflowX === "hidden";
}

function getParentAcrossShadowRoot(el: HTMLElement): HTMLElement {
  if (el.parentElement) return el.parentElement;
  const root: any = typeof el.getRootNode === "function" ? el.getRootNode() : null;
  return (!!root && root !== el && root.host) || null;
}

// The part of the element that horizontally sticky siblings on the way up to the scroller (a matrix row header,
// an actions cell) currently cover: the element can be inside the scroller's band and still be hidden under them.
function getStickyOverlapDelta(el: HTMLElement, scroller: HTMLElement): number {
  const elRect = el.getBoundingClientRect();
  let node = el;
  while(!!node && node !== scroller) {
    const parent = node.parentElement;
    const siblings = !!parent ? parent.children : <any>[];
    for (let i = 0; i < siblings.length; i++) {
      const sibling = siblings[i] as HTMLElement;
      if (sibling === node) continue;
      const style = DomDocumentHelper.getComputedStyle(sibling);
      if (!style || style.position !== "sticky") continue;
      const rect = sibling.getBoundingClientRect();
      if (rect.bottom <= elRect.top || rect.top >= elRect.bottom || rect.right <= elRect.left || rect.left >= elRect.right) continue;
      if (style.left !== "auto" && rect.left <= elRect.left) return elRect.left - rect.right;
      if (style.right !== "auto" && rect.right >= elRect.right) return elRect.right - rect.left;
    }
    node = parent;
  }
  return 0;
}

function revealElementInHorizontalScroller(el: HTMLElement, scroller: HTMLElement): void {
  const elRect = el.getBoundingClientRect();
  const { left, right } = getHorizontalViewport(scroller);
  const delta = getNearestScrollDelta(elRect.left, elRect.right, left, right, DomDocumentHelper.isRtlDirection(scroller));
  // The scroll offset is negative in RTL, but it still grows to the right, so a visual delta applies as is.
  if (Math.abs(delta) >= 1) {
    scroller.scrollLeft += delta;
  }
  const stickyDelta = getStickyOverlapDelta(el, scroller);
  if (Math.abs(stickyDelta) >= 1) {
    scroller.scrollLeft += stickyDelta;
  }
}

// Brings the element into every horizontally clipping ancestor, innermost first, with the least movement.
// The survey calls it when it focuses with preventScroll, which suppresses the native horizontal reveal
// together with the vertical one. Vertical positioning stays with scrollElementIntoScroller.
export function revealElementHorizontally(el: HTMLElement): void {
  if (!el || typeof el.getBoundingClientRect !== "function") return;
  let parent = getParentAcrossShadowRoot(el);
  while(!!parent) {
    if (isHorizontalScroller(parent)) {
      revealElementInHorizontalScroller(el, parent);
    }
    parent = getParentAcrossShadowRoot(parent);
  }
}

interface IScrollAnimation {
  owner: any;
  frameId: number | null;
}
const scrollerAnimations = new WeakMap<HTMLElement, IScrollAnimation>();
const smoothScrollDuration = 500;

export interface IScrollElementIntoScrollerOptions {
  block?: ScrollLogicalPosition;
  behavior?: ScrollBehavior;
  // Identifies who started a smooth scroll so that only that owner's teardown cancels it.
  owner?: any;
}

// Stops the running smooth scroll of the scroller. With an owner, only an animation started by that owner
// is stopped: surveys that share a scroller (e.g. the document) must not cancel each other's newer requests.
export function cancelScrollAnimation(scroller: HTMLElement, owner?: any): void {
  const animation = !!scroller ? scrollerAnimations.get(scroller) : undefined;
  if (!animation || (owner !== undefined && animation.owner !== owner)) return;
  scrollerAnimations.delete(scroller);
  if (animation.frameId !== null) {
    DomWindowHelper.cancelAnimationFrame(animation.frameId);
    animation.frameId = null;
  }
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function animateScrollTo(scroller: HTMLElement, top: number, duration: number, owner: any): void {
  const start = scroller.scrollTop;
  const change = top - start;
  if (Math.abs(change) < 1 || duration <= 0) {
    scroller.scrollTop = top;
    return;
  }
  const animation: IScrollAnimation = { owner: owner, frameId: null };
  const requestFrame = () => {
    animation.frameId = DomWindowHelper.requestAnimationFrame(step);
    if (animation.frameId === null) {
      scrollerAnimations.delete(scroller);
    }
  };
  let startedAt: number | null = null;
  const step = (now: number) => {
    // A cancelled or replaced animation stops even when its frame was already dispatched.
    if (scrollerAnimations.get(scroller) !== animation) return;
    animation.frameId = null;
    if (startedAt === null) startedAt = now;
    const t = Math.min(1, (now - startedAt) / duration);
    scroller.scrollTop = start + change * easeInOutCubic(t);
    if (t < 1) {
      requestFrame();
    } else {
      scrollerAnimations.delete(scroller);
    }
  };
  scrollerAnimations.set(scroller, animation);
  requestFrame();
}

export function scrollElementIntoScroller(el: HTMLElement, scroller: HTMLElement, options?: IScrollElementIntoScrollerOptions): void {
  if (!el || !scroller) return;
  // Any new request supersedes the running animation, including a request that needs no movement.
  cancelScrollAnimation(scroller);
  const elRect = el.getBoundingClientRect();
  const { top: visibleTop, height: visibleHeight } = getScrollerViewport(scroller);
  let delta = 0;
  const block = options?.block || "nearest";
  if (block === "center" && elRect.height < visibleHeight) {
    delta = (elRect.top + elRect.height / 2) - (visibleTop + visibleHeight / 2);
  } else if (elRect.top < visibleTop) {
    delta = elRect.top - visibleTop;
  } else if (elRect.bottom > visibleTop + visibleHeight) {
    delta = elRect.bottom - (visibleTop + visibleHeight);
  }
  if (Math.abs(delta) < 1) return;
  const top = scroller.scrollTop + delta;
  const behavior = options?.behavior || "auto";
  if (behavior !== "auto") {
    animateScrollTo(scroller, top, smoothScrollDuration, options?.owner);
  } else {
    scroller.scrollTop = top;
  }
}
