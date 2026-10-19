import { ILayoutElementModel, LayoutElementContainer, ISurveyLayoutElement } from "./base-interfaces";
import { ActionContainer } from "./actions/container";
import type { SurveyModel } from "./survey";

interface ISurveyNavigationLayout {
  navigationBar: ActionContainer;
  hasVisibleNavigationActions: boolean;
  isNavigationButtonsShowingOnTop: boolean;
  isNavigationButtonsShowingOnBottom: boolean;
}

export class SurveyNavigationLayoutModel implements ILayoutElementModel {
  public constructor(private survey: ISurveyNavigationLayout) {
  }

  public createLayoutElements(): Array<ISurveyLayoutElement> {
    const bottomLayoutElement: ISurveyLayoutElement = {
      id: "buttons-navigation",
      component: "sv-action-bar",
      getData: () => this.survey.navigationBar,
      isInContainer: (container: LayoutElementContainer) => this.isBottomNavigationButtonsInContainer(container)
    };
    const topLayoutElement: ISurveyLayoutElement = {
      id: "buttons-navigation-top",
      component: "sv-action-bar",
      getData: () => this.survey.navigationBar,
      isInContainer: (container: LayoutElementContainer) => this.isTopNavigationButtonsInContainer(container)
    };
    return [bottomLayoutElement, topLayoutElement];
  }

  private isTopNavigationButtonsInContainer(container: LayoutElementContainer): boolean {
    return container === "contentTop" && this.survey.isNavigationButtonsShowingOnTop && this.survey.hasVisibleNavigationActions;
  }

  private isBottomNavigationButtonsInContainer(container: LayoutElementContainer): boolean {
    return container === "contentBottom" && this.survey.isNavigationButtonsShowingOnBottom && this.survey.hasVisibleNavigationActions;
  }
}
