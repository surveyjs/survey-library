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
      requestAnimationFrame(checkPos);
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

export function scrollElementToTop(element: Element, scrollIfVisible?: boolean, scrollIntoViewOptions?: ScrollIntoViewOptions, doneCallback?: () => void): boolean {
  return scrollElementToViewCore(element, false, scrollIfVisible, scrollIntoViewOptions, doneCallback);
}

export function getQuestionElementForScroller(el: HTMLElement): HTMLElement {
  if (!el || typeof el.closest !== "function") return el;
  return (el.closest("[data-name]") as HTMLElement) || el;
}

export function getScrollContainerForElement(el: HTMLElement): HTMLElement | null {
  if (!el) return null;
  const innerScroller = typeof el.closest === "function" ? el.closest(".sv-scroll__scroller") as HTMLElement : null;
  if (innerScroller) return innerScroller;
  return (findScrollableParent(el.parentElement) as HTMLElement) || null;
}

export function isDocumentScroller(scroller: HTMLElement): boolean {
  const doc = DomDocumentHelper.getDocument();
  const docEl = DomDocumentHelper.getDocumentElement();
  const body = DomDocumentHelper.getBody();
  return !!scroller && (scroller === docEl || scroller === body || (!!doc && scroller === doc.scrollingElement));
}

export function scrollElementIntoScroller(el: HTMLElement, scroller: HTMLElement, options?: { block?: ScrollLogicalPosition, behavior?: ScrollBehavior }): void {
  if (!el || !scroller) return;
  const elRect = el.getBoundingClientRect();
  const scrollerRect = scroller.getBoundingClientRect();
  const documentScroller = isDocumentScroller(scroller);
  const visibleTop = documentScroller ? 0 : scrollerRect.top;
  const visibleHeight = documentScroller
    ? (DomWindowHelper.getInnerHeight() || scroller.clientHeight)
    : (scrollerRect.height || (scrollerRect.bottom - scrollerRect.top));
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
  if (behavior !== "auto" && typeof scroller.scrollTo === "function") {
    scroller.scrollTo({ top, behavior });
  } else {
    scroller.scrollTop = top;
  }
}
