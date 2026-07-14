export interface ISurveyStickyHost {
  rootElement: HTMLElement;
  readonly tocModel: { updateStickyTOCSize(rootElement: HTMLElement): void };
  onScrollCallback?: () => void;
}

export class SurveyStickyController {
  private survey: ISurveyStickyHost;

  public scrollerElement: HTMLElement;
  public scrollHandler: () => void;

  constructor(survey: ISurveyStickyHost) {
    this.survey = survey;
  }

  // private _lastScrollTop = 0;
  public isElementShouldBeSticky(selector: string): boolean {
    if (!selector) return false;
    const scrollerElement = this.scrollerElement;
    const topStickyContainer = scrollerElement?.querySelector(selector);
    if (!!topStickyContainer) {
      // const scrollDirection = this.rootElement.scrollTop > this._lastScrollTop ? "down" : "up";
      // this._lastScrollTop = this.rootElement.scrollTop;
      return !!scrollerElement && scrollerElement.scrollTop > 0 && topStickyContainer.getBoundingClientRect().y <= scrollerElement.getBoundingClientRect().y;
    }
    return false;
  }

  public onScroll(): void {
    const rootElement = this.survey.rootElement;
    if (!!rootElement) {
      if (this.isElementShouldBeSticky(".sv-components-container-center")) {
        rootElement.classList && rootElement.classList.add("sv-root--sticky-top");
      } else {
        rootElement.classList && rootElement.classList.remove("sv-root--sticky-top");
      }
      const tocModel = this.survey.tocModel;
      if (!!tocModel) {
        tocModel.updateStickyTOCSize(rootElement);
      }
    }
    if (this.survey.onScrollCallback) {
      this.survey.onScrollCallback();
    }
  }

  public addScrollEventListener(): void {
    const rootElement = this.survey.rootElement;
    this.scrollerElement = rootElement.getElementsByClassName("sv-scroll__scroller")[0] as HTMLElement;
    const scrollerElement = this.scrollerElement;
    this.scrollHandler = () => { this.onScroll(); };
    rootElement.addEventListener("scroll", this.scrollHandler);
    if (!!rootElement.getElementsByTagName("form")[0]) {
      rootElement.getElementsByTagName("form")[0].addEventListener("scroll", this.scrollHandler);
    }
    if (!!scrollerElement) {
      scrollerElement.addEventListener("scroll", this.scrollHandler);
    }
  }

  public removeScrollEventListener(): void {
    const rootElement = this.survey.rootElement;
    const scrollerElement = this.scrollerElement;
    if (!!rootElement && !!this.scrollHandler) {
      rootElement.removeEventListener("scroll", this.scrollHandler);
      if (!!rootElement.getElementsByTagName("form")[0]) {
        rootElement.getElementsByTagName("form")[0].removeEventListener("scroll", this.scrollHandler);
      }
      if (!!scrollerElement) {
        scrollerElement.removeEventListener("scroll", this.scrollHandler);
      }
    }
    this.scrollerElement = undefined;
  }
}
