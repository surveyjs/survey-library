import { DomWindowHelper } from "../global_variables_utils";

export function getClosestSurveyScroller(el: Element): HTMLElement | null {
  if (!el || typeof el.closest !== "function") return null;
  return el.closest(".sv-scroll__scroller") as HTMLElement;
}

export function isNeedScrollIntoScroller(el: Element, scroller: HTMLElement, scrollIfVisible?: boolean): boolean {
  if (scrollIfVisible) return true;
  const elTop = el.getBoundingClientRect().top;
  const rect = scroller.getBoundingClientRect();
  const height = rect.height || (rect.bottom - rect.top);
  return elTop < rect.top || elTop > rect.top + height;
}

function waitForScrollEnd(scroller: HTMLElement, doneCallback: () => void): void {
  let lastPos: number = null;
  let same: number = 0;
  const checkPos = () => {
    const newPos = scroller.scrollTop;
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

// Scrolls only the survey's own scroller: native scrollIntoView would also scroll the host page.
export function scrollElementIntoScroller(el: Element, scroller: HTMLElement, scrollIntoViewOptions?: ScrollIntoViewOptions, doneCallback?: () => void): void {
  const elRect = el.getBoundingClientRect();
  const scrollerRect = scroller.getBoundingClientRect();
  const visibleHeight = scrollerRect.height || (scrollerRect.bottom - scrollerRect.top);
  const block = scrollIntoViewOptions?.block || "start";
  let delta = elRect.top - scrollerRect.top;
  if (block === "center" && elRect.height < visibleHeight) {
    delta = (elRect.top + elRect.height / 2) - (scrollerRect.top + visibleHeight / 2);
  } else if (block === "end") {
    delta = elRect.bottom - (scrollerRect.top + visibleHeight);
  } else if (block === "nearest") {
    delta = elRect.top < scrollerRect.top ? elRect.top - scrollerRect.top :
      (elRect.bottom > scrollerRect.top + visibleHeight ? elRect.bottom - (scrollerRect.top + visibleHeight) : 0);
  }
  if (Math.abs(delta) < 1) {
    doneCallback && doneCallback();
    return;
  }
  const top = scroller.scrollTop + delta;
  if (scrollIntoViewOptions?.behavior === "smooth" && typeof scroller.scrollTo === "function") {
    scroller.scrollTo({ top: top, behavior: "smooth" });
    if (typeof doneCallback === "function") {
      waitForScrollEnd(scroller, doneCallback);
    }
  } else {
    scroller.scrollTop = top;
    doneCallback && doneCallback();
  }
}
