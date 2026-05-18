import { ISurveyLayoutElement, LayoutElementContainer } from "./base-interfaces";
import { surveyCss } from "./defaultCss/defaultCss";
import { Cover } from "./header";
import { settings } from "./settings";
import type { SurveyModel } from "./survey";

export class SurveyLayoutElementsFactory {
  public constructor(private survey: SurveyModel) {
  }

  public createAdvancedHeaderLayoutElement(advHeader: Cover): ISurveyLayoutElement {
    advHeader.survey = this.survey;
    const layoutElement: ISurveyLayoutElement = {
      id: "advanced-header",
      container: "header",
      component: "sv-header",
      index: -100,
      data: advHeader,
      processResponsiveness: () => advHeader.processResponsiveness(),
      isInContainer: (container: LayoutElementContainer) => this.isAdvancedHeaderInContainer(layoutElement, container)
    };
    return layoutElement;
  }

  public createLayoutElements(): Array<ISurveyLayoutElement> {
    const res = new Array<ISurveyLayoutElement>();
    res.push({
      id: "timerpanel",
      template: "survey-timerpanel",
      component: "sv-timerpanel",
      getData: () => this.survey.timerModel,
      isInContainer: (container: LayoutElementContainer) => this.isTimerPanelInContainer(container)
    });
    const progressButtonsLayoutElement: ISurveyLayoutElement = {
      id: "progress-buttons",
      component: "sv-progress-buttons",
      getData: () => this.survey.progressBar,
      processResponsiveness: width => this.survey.progressBar.processResponsiveness && this.survey.progressBar.processResponsiveness(width),
      isInContainer: (container: LayoutElementContainer) => this.isProgressBarInContainer(progressButtonsLayoutElement, container)
    };
    res.push(progressButtonsLayoutElement);
    const progressQuestionsLayoutElement: ISurveyLayoutElement = {
      id: "progress-questions",
      component: "sv-progress-questions",
      data: this.survey,
      isInContainer: (container: LayoutElementContainer) => this.isProgressBarInContainer(progressQuestionsLayoutElement, container)
    };
    res.push(progressQuestionsLayoutElement);
    const progressPagesLayoutElement: ISurveyLayoutElement = {
      id: "progress-pages",
      component: "sv-progress-pages",
      data: this.survey,
      isInContainer: (container: LayoutElementContainer) => this.isProgressBarInContainer(progressPagesLayoutElement, container)
    };
    res.push(progressPagesLayoutElement);
    const progressCorrectQuestionsLayoutElement: ISurveyLayoutElement = {
      id: "progress-correctquestions",
      component: "sv-progress-correctquestions",
      data: this.survey,
      isInContainer: (container: LayoutElementContainer) => this.isProgressBarInContainer(progressCorrectQuestionsLayoutElement, container)
    };
    res.push(progressCorrectQuestionsLayoutElement);
    const progressRequiredQuestionsLayoutElement: ISurveyLayoutElement = {
      id: "progress-requiredquestions",
      component: "sv-progress-requiredquestions",
      data: this.survey,
      isInContainer: (container: LayoutElementContainer) => this.isProgressBarInContainer(progressRequiredQuestionsLayoutElement, container)
    };
    res.push(progressRequiredQuestionsLayoutElement);
    res.push({
      id: "toc-navigation",
      component: "sv-navigation-toc",
      getData: () => this.survey.tocModel,
      processResponsiveness: width => this.survey.tocModel.updateStickyTOCSize(this.survey.rootElement),
      isInContainer: (container: LayoutElementContainer) => this.isTocNavigationInContainer(container)
    });
    res.push({
      id: "buttons-navigation",
      component: "sv-action-bar",
      getData: () => this.survey.navigationBar,
      isInContainer: (container: LayoutElementContainer) => this.isBottomNavigationButtonsInContainer(container)
    });
    res.push({
      id: "buttons-navigation-top",
      component: "sv-action-bar",
      getData: () => this.survey.navigationBar,
      isInContainer: (container: LayoutElementContainer) => this.isTopNavigationButtonsInContainer(container)
    });
    return res;
  }

  private getProgressBarComponentName(): string {
    let actualProgressBarType = this.survey.progressBarType;
    if (!settings.legacyProgressBarView && surveyCss.currentType === "default") {
      if (isStrCiEqual(actualProgressBarType, "pages")) {
        actualProgressBarType = "buttons";
      }
    }
    return "progress-" + actualProgressBarType;
  }

  private isTimerPanelInContainer(container: LayoutElementContainer): boolean {
    if (this.survey.mode === "display" || this.survey.isStartPageActive) return false;
    if (container === "header") return this.survey.isTimerPanelShowingOnTop;
    if (container === "footer") return this.survey.isTimerPanelShowingOnBottom;
    return false;
  }

  private isProgressBarInContainer(layoutElement: ISurveyLayoutElement, container: LayoutElementContainer): boolean {
    if (this.survey.state !== "running" || !isStrCiEqual(layoutElement.id, this.getProgressBarComponentName())) return false;
    if (this.survey.questionsOnPageMode == "singlePage" && this.survey.progressBarType != "questions") return false;

    const headerLayoutElement = this.survey.findLayoutElement("advanced-header");
    const advHeader = headerLayoutElement && headerLayoutElement.data as Cover;
    let isBelowHeader = !advHeader || advHeader.hasBackground;
    if (isStrCiEqual(this.survey.progressBarLocation, "aboveHeader")) {
      isBelowHeader = false;
    }
    if (isStrCiEqual(this.survey.progressBarLocation, "belowHeader")) {
      isBelowHeader = true;
    }

    if (this.survey.showTOC && !(advHeader && advHeader.hasBackground) && !this.survey.isStartPageActive) {
      if (container === "center" && this.survey.isShowProgressBarOnTop) {
        if (!isBelowHeader) {
          layoutElement.index = -150;
        } else {
          delete layoutElement.index;
        }
        return true;
      }
      if (container === "contentBottom" && this.survey.isShowProgressBarOnBottom) {
        layoutElement.index = 150;
        return true;
      }
      return false;
    }

    if (container === "header" && !isBelowHeader) {
      layoutElement.index = -150;
      return this.survey.isShowProgressBarOnTop && !this.survey.isStartPageActive;
    }
    if (container === "center" && isBelowHeader) {
      if (!!layoutElement.index) {
        delete layoutElement.index;
      }
      return this.survey.isShowProgressBarOnTop && !this.survey.isStartPageActive;
    }
    if (container === "footer") {
      return this.survey.isShowProgressBarOnBottom && !this.survey.isStartPageActive;
    }
    return false;
  }

  private isTopNavigationButtonsInContainer(container: LayoutElementContainer): boolean {
    return container === "contentTop" && this.survey.isNavigationButtonsShowingOnTop;
  }

  private isBottomNavigationButtonsInContainer(container: LayoutElementContainer): boolean {
    return container === "contentBottom" && this.survey.isNavigationButtonsShowingOnBottom;
  }

  private isTocNavigationInContainer(container: LayoutElementContainer): boolean {
    if (this.survey.state !== "running" || !this.survey.showTOC) return false;
    if (container === "left") return ["left", "both"].indexOf(this.survey.tocLocation) !== -1;
    if (container === "right") return ["right", "both"].indexOf(this.survey.tocLocation) !== -1;
    return false;
  }

  private isAdvancedHeaderInContainer(layoutElement: ISurveyLayoutElement, container: LayoutElementContainer): boolean {
    const canShowHeader = this.survey.state === "running" || this.survey.state === "starting" || (this.survey.showHeaderOnCompletePage === true && this.survey.state === "completed");
    if (!canShowHeader) return false;

    const advHeader = layoutElement && layoutElement.data as Cover;
    if (this.survey.showTOC && !(advHeader && advHeader.hasBackground)) {
      return container === "contentTop";
    }
    return layoutElement.container === container;
  }

  private isElementInContainerByContainerProperty(layoutElement: ISurveyLayoutElement, container: LayoutElementContainer): boolean {
    return Array.isArray(layoutElement.container) && layoutElement.container.indexOf(container) !== -1 || layoutElement.container === container;
  }

  public isLayoutElementInContainer(layoutElement: ISurveyLayoutElement, container: LayoutElementContainer): boolean {
    if (!!layoutElement.isInContainer) {
      return layoutElement.isInContainer(container);
    }
    if (this.survey.mode !== "display" && isStrCiEqual(layoutElement.id, "timerpanel")) {
      return this.isTimerPanelInContainer(container);
    }
    if (isStrCiEqual(layoutElement.id, this.getProgressBarComponentName())) {
      return this.isProgressBarInContainer(layoutElement, container);
    }
    if (isStrCiEqual(layoutElement.id, "buttons-navigation-top")) {
      return this.isTopNavigationButtonsInContainer(container);
    }
    if (isStrCiEqual(layoutElement.id, "buttons-navigation")) {
      return this.isBottomNavigationButtonsInContainer(container);
    }
    if (isStrCiEqual(layoutElement.id, "toc-navigation")) {
      return this.isTocNavigationInContainer(container);
    }
    if (isStrCiEqual(layoutElement.id, "advanced-header")) {
      return this.isAdvancedHeaderInContainer(layoutElement, container);
    }
    return this.isElementInContainerByContainerProperty(layoutElement, container);
  }
}

function isStrCiEqual(a: string, b: string) {
  if (!a) return false;
  if (!b) return false;
  return a.toUpperCase() === b.toUpperCase();
}