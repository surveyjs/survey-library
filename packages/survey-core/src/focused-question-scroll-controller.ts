import { settings } from "./settings";
import { DomWindowHelper } from "./global_variables_utils";
import { getScrollContainerForElement, getScrollerViewport, scrollElementIntoScroller } from "./utils/scroll-utils";

export interface IFocusedQuestionScrollHost {
  autoCenterFocusedQuestion: boolean;
  rootElement: HTMLElement;
  scrollerElement?: Element;
}

// Centers the question that receives focus inside its scroll container (autoCenterFocusedQuestion).
// The survey owns the property and the render/destroy/dispose hooks and delegates to this controller.
export class FocusedQuestionScrollController {
  private focusInHandler = (e: FocusEvent) => this.onFocusIn(e);
  private attachedRoot: HTMLElement;
  private setupGeneration = 0;

  constructor(private host: IFocusedQuestionScrollHost) {}

  public setup(): void {
    this.dispose();
    if (!this.host.autoCenterFocusedQuestion || !this.host.rootElement || !DomWindowHelper.isAvailable()) return;
    const generation = ++this.setupGeneration;
    // Attach after the rendering pass that triggered the setup settles.
    DomWindowHelper.requestAnimationFrame(() => {
      if (generation !== this.setupGeneration || !this.host.rootElement) return;
      this.attachedRoot = this.host.rootElement;
      this.attachedRoot.addEventListener("focusin", this.focusInHandler);
    });
  }
  public dispose(): void {
    // Invalidates a setup whose frame has not run yet.
    this.setupGeneration++;
    if (this.attachedRoot) {
      this.attachedRoot.removeEventListener("focusin", this.focusInHandler);
      this.attachedRoot = undefined;
    }
  }
  public scrollIntoView(target: HTMLElement): void {
    if (!this.host.autoCenterFocusedQuestion) return;
    if (!target || typeof target.getBoundingClientRect !== "function") return;
    const questionEl = FocusedQuestionScrollController.getQuestionElement(target);
    const elToScroll = questionEl || target;
    const scroller = this.getScroller(elToScroll);
    if (!scroller) return;
    const questionRect = elToScroll.getBoundingClientRect();
    const visibleHeight = getScrollerViewport(scroller).height;
    // A question that fits the container is centered. A taller one would clip the
    // focused control if we centered the question box, so keep that control in view.
    const el = questionEl && questionRect.height <= visibleHeight ? questionEl : target;
    scrollElementIntoScroller(el, scroller, {
      block: "center",
      behavior: settings.animationEnabled ? "smooth" : "auto"
    });
  }
  public static getQuestionElement(el: HTMLElement): HTMLElement {
    if (!el || typeof el.closest !== "function") return el;
    return (el.closest("[data-name]") as HTMLElement) || el;
  }
  private getScroller(el: HTMLElement): HTMLElement {
    const scrollerElement = this.host.scrollerElement as HTMLElement;
    return getScrollContainerForElement(el)
      || ((scrollerElement && scrollerElement.contains(el)) ? scrollerElement : null);
  }
  private onFocusIn(e: FocusEvent): void {
    this.scrollIntoView(e.target as HTMLElement);
  }
}
