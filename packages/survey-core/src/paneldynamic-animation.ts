import { SurveyElement } from "./survey-element";
import { classesToSelector } from "./utils/dom-utils";
import { cleanHtmlElementAfterAnimation, prepareElementForVerticalAnimation, setPropertiesOnElementForAnimation } from "./utils/animation-dom";
import { toCssClasses } from "./utils/cssClassBuilder";
import { AnimationGroup, AnimationProperty, AnimationTab, IAnimationConsumer, IAnimationGroupConsumer } from "./utils/animation";
import { getScrollBehavior } from "./utils/reduced-motion";
import type { PanelModel } from "./panel";
import type { QuestionPanelDynamicModel } from "./question_paneldynamic";

// What the panels' animation reads from the dynamic panel besides its public members.
export interface IPanelDynamicAnimationOwner {
  readonly question: QuestionPanelDynamicModel;
  // The stored rendered panels: the animation writes them as it runs.
  renderedPanels: Array<PanelModel>;
  getPanels(): Array<PanelModel>;
  getPanelVisibleIndex(panel: PanelModel): number;
  // The animation ended: the panels that animated out are off the screen now.
  disposeLeftPanels(rendered: Array<PanelModel>): void;
}

/* The animation of the rendered panels: a group in list mode, a tab otherwise. The direction of a
   carousel or tab move is taken from the visibleIndex of the panel that leaves, of the one it
   replaced, or of the removed one; the new panel added from the UI is focused when the animation
   ends. */
export class PanelDynamicAnimation {
  private animation: AnimationProperty<Array<PanelModel>, IAnimationGroupConsumer<PanelModel>>;
  private isRunning: boolean = false;
  /* The visibleIndex of the current panel, and of the one it replaced. A carousel Next rebuilds the
     page, so the panel that leaves is not in visiblePanels any more and its position there cannot
     say which way it goes: the two records' positions in the whole list do. */
  public currentVisibleIndex: number = -1;
  public leftVisibleIndex: number = -1;
  // The visibleIndex of the removed panel and the panel itself: the animation that follows takes its
  // direction from them.
  public removedPanelIndex: number;
  public removedPanel: PanelModel;
  public focusNewPanelCallback: () => void;
  constructor(private owner: IPanelDynamicAnimationOwner) { }
  // The current panel is announced at visibleIndex: the one it replaced is the one that leaves.
  public moveCurrentVisibleIndex(visibleIndex: number): void {
    this.leftVisibleIndex = this.currentVisibleIndex;
    this.currentVisibleIndex = visibleIndex;
  }
  public get panelsAnimation(): AnimationProperty<Array<PanelModel>, IAnimationGroupConsumer<PanelModel>> {
    if (!this.animation) {
      this.resetPanelsAnimation();
    }
    return this.animation;
  }
  // A new display mode animates as a group or as a tab.
  public resetPanelsAnimation(): void {
    this.animation = new (this.owner.question.isRenderModeList ? AnimationGroup : AnimationTab)(this.getAnimationOptions(), (val, isTempUpdate?: boolean) => {
      this.owner.renderedPanels = val;
      if (!isTempUpdate) {
        this.isRunning = false;
        this.owner.disposeLeftPanels(val);
        this.focusNewPanel();
      }
    }, () => this.owner.renderedPanels);
  }
  // The first panels shown and the last ones hidden are not animated.
  public syncRenderedPanels(val: Array<PanelModel>): void {
    const question = this.owner.question;
    if (this.owner.renderedPanels.length == 0 || val.length == 0) {
      question.blockAnimations();
      this.panelsAnimation.sync(val);
      question.releaseAnimations();
    } else {
      this.isRunning = true;
      this.panelsAnimation.sync(val);
    }
  }
  public disablePanelsAnimations(): void {
    this.owner.getPanels().forEach((panel) => {
      panel.blockAnimations();
    });
  }
  public enablePanelsAnimations(): void {
    this.owner.getPanels().forEach((panel) => {
      panel.releaseAnimations();
    });
  }
  // A running animation focuses the new panel when it ends.
  public focusNewPanelWhenIdle(focus: () => void): void {
    this.focusNewPanelCallback = focus;
    if (!this.isRunning) {
      this.focusNewPanel();
    }
  }
  private focusNewPanel(): void {
    if (this.focusNewPanelCallback) {
      this.focusNewPanelCallback();
      this.focusNewPanelCallback = undefined;
    }
  }
  public getAnimationOptions(): IAnimationConsumer<[PanelModel]> {
    const question = this.owner.question;
    const getDirectionCssClass = () => {
      if (question.isRenderModeList) return "";
      const leavingPanel = this.owner.renderedPanels.filter(el => el !== question.currentPanel)[0];
      // A panel that is still on the page answers for itself; one a page move took away is the one
      // the current panel replaced; one that was removed is neither.
      const leavingIndex = this.owner.getPanelVisibleIndex(leavingPanel);
      const isRemoving = leavingIndex < 0 && (!leavingPanel || leavingPanel === this.removedPanel || this.leftVisibleIndex < 0);
      let leavingPanelIndex = leavingIndex > -1 ? leavingIndex : this.leftVisibleIndex;
      if (isRemoving) {
        leavingPanelIndex = this.removedPanelIndex;
      }
      return toCssClasses(
        !!this.focusNewPanelCallback && "sv-pd-animation-adding",
        isRemoving && "sv-pd-animation-removing",
        leavingPanelIndex <= question.currentIndex && "sv-pd-animation-left",
        leavingPanelIndex > question.currentIndex && "sv-pd-animation-right"
      );
    };
    // Carousel and tab mode animate the height of the panel's container; list mode the panel itself.
    const prepareHeight = (el: HTMLElement, heightKey: "heightTo" | "heightFrom"): void => {
      if (!question.isRenderModeList && el.parentElement) {
        setPropertiesOnElementForAnimation(el.parentElement, { [heightKey]: el.offsetHeight + "px" });
      } else {
        prepareElementForVerticalAnimation(el);
      }
    };
    const cleanAfterAnimation = (el: HTMLElement): void => {
      cleanHtmlElementAfterAnimation(el);
      if (el.parentElement) {
        cleanHtmlElementAfterAnimation(el.parentElement);
      }
    };
    return {
      getRerenderEvent: () => question.onElementRerendered,
      getAnimatedElement: (panel) => {
        if (panel && question.cssContent) {
          const contentSelector = classesToSelector(question.cssContent);
          return question.getWrapperElement()?.querySelector(`:scope ${contentSelector} #${panel.id}`)?.parentElement;
        }
      },
      getEnterOptions: () => {
        const cssClass = toCssClasses(question.cssClasses.panelWrapperEnter, getDirectionCssClass());
        return {
          onBeforeRunAnimation: (el) => {
            if (this.focusNewPanelCallback) {
              const scolledElement = question.isRenderModeList ? el : el.parentElement;
              SurveyElement.ScrollElementToViewCore(scolledElement, false, false, { behavior: getScrollBehavior() });
            }
            prepareHeight(el, "heightTo");
          },
          onAfterRunAnimation: cleanAfterAnimation,
          cssClass: cssClass
        };
      },
      getLeaveOptions: () => {
        const cssClass = toCssClasses(question.cssClasses.panelWrapperLeave, getDirectionCssClass());
        return {
          onBeforeRunAnimation: (el) => { prepareHeight(el, "heightFrom"); },
          onAfterRunAnimation: cleanAfterAnimation,
          cssClass: cssClass
        };
      },
      isAnimationEnabled: () => {
        return question.animationAllowed && !!question.getWrapperElement();
      },
    };
  }
}
