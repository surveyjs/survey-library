import { DomDocumentHelper, DomWindowHelper } from "../global_variables_utils";

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

function isNeedScrollIntoScroller(el: Element, scroller: HTMLElement, scrollIfVisible?: boolean): boolean {
  if (scrollIfVisible) return true;
  const elTop = el.getBoundingClientRect().top;
  const { top, height } = getScrollerViewport(scroller);
  return elTop < top || elTop > top + height;
}

export function scrollElementToViewCore(el: Element, checkLeft: boolean, scrollIfVisible?: boolean, scrollIntoViewOptions?: ScrollIntoViewOptions, doneCallback?: () => void): boolean {
  if (!el || !el.scrollIntoView) {
    doneCallback && doneCallback();
    return false;
  }
  // A survey that scrolls inside its own container (fitToContainer) is measured against and scrolled within
  // that container: the window says nothing about what is visible there, and native scrollIntoView
  // would also scroll the host page.
  const surveyScroller = getClosestSurveyScroller(el as HTMLElement);
  if (!!surveyScroller && isNeedScrollIntoScroller(el, surveyScroller, scrollIfVisible)) {
    scrollElementIntoScroller(el as HTMLElement, surveyScroller, {
      block: scrollIntoViewOptions?.block || "start",
      behavior: scrollIntoViewOptions?.behavior,
      onDone: doneCallback
    });
    return true;
  }
  // The scroller does not hide the element: a survey that does not clip its pages scrolls with the document.
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

interface IScrollAnimation {
  owner: any;
  frameId: number | null;
  onDone?: () => void;
}
const scrollerAnimations = new WeakMap<HTMLElement, IScrollAnimation>();
const smoothScrollDuration = 500;

export interface IScrollElementIntoScrollerOptions {
  block?: ScrollLogicalPosition;
  behavior?: ScrollBehavior;
  // Identifies who started a smooth scroll so that only that owner's teardown cancels it.
  owner?: any;
  // Runs once the scroll is over: at once for an immediate scroll or no movement, at the end of a smooth
  // scroll, or when a smooth scroll is cancelled or replaced (callers may hold a state until it runs).
  onDone?: () => void;
}

function completeScrollAnimation(animation: IScrollAnimation): void {
  const onDone = animation.onDone;
  animation.onDone = undefined;
  onDone && onDone();
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
  completeScrollAnimation(animation);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function animateScrollTo(scroller: HTMLElement, top: number, duration: number, owner: any, onDone?: () => void): void {
  const start = scroller.scrollTop;
  const change = top - start;
  if (Math.abs(change) < 1 || duration <= 0) {
    scroller.scrollTop = top;
    onDone && onDone();
    return;
  }
  const animation: IScrollAnimation = { owner: owner, frameId: null, onDone: onDone };
  const requestFrame = () => {
    animation.frameId = DomWindowHelper.requestAnimationFrame(step);
    if (animation.frameId === null) {
      scrollerAnimations.delete(scroller);
      completeScrollAnimation(animation);
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
      completeScrollAnimation(animation);
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
  const onDone = options?.onDone;
  let delta = 0;
  const block = options?.block || "nearest";
  if (block === "start") {
    delta = elRect.top - visibleTop;
  } else if (block === "center" && elRect.height < visibleHeight) {
    delta = (elRect.top + elRect.height / 2) - (visibleTop + visibleHeight / 2);
  } else if (elRect.top < visibleTop) {
    delta = elRect.top - visibleTop;
  } else if (elRect.bottom > visibleTop + visibleHeight) {
    delta = elRect.bottom - (visibleTop + visibleHeight);
  }
  if (Math.abs(delta) < 1) {
    onDone && onDone();
    return;
  }
  const top = scroller.scrollTop + delta;
  if (options?.behavior === "smooth") {
    animateScrollTo(scroller, top, smoothScrollDuration, options?.owner, onDone);
  } else {
    scroller.scrollTop = top;
    onDone && onDone();
  }
}
