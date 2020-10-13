import * as React from "react";
import { SurveyNavigationBase } from "./reactSurveyNavigationBase";
import { ReactElementFactory } from "./element-factory";
import { PageModel } from "../page";

export class SurveyProgressButtons extends SurveyNavigationBase {
  constructor(props: any) {
    super(props);
  }
  render(): JSX.Element {
    return (
      <div className={this.css.progressButtonsContainerCenter}>
        <div className={this.css.progressButtonsContainer}>
          <img className={this.getScrollButtonCss(true)}></img>
          <div className={this.css.progressButtonsListContainer}>
            <ul className={this.css.progressButtonsList}>
              {this.getListElements()}
            </ul>
          </div>
          <img className={this.getScrollButtonCss(false)}></img>
        </div>
      </div>
    );
  }
  protected getScrollButtonCss(isLeftScroll: boolean): string {
    return "";
  }
  protected getListElements(): JSX.Element[] {
    let buttons: JSX.Element[] = [];
    this.survey.visiblePages.forEach((page: PageModel) => {
      buttons.push(this.renderListElement(page));
    });
    return buttons;
  }
  protected renderListElement(page: PageModel): JSX.Element {
    return (
      <li key={"listelement" + page.visibleIndex} className={this.getListElementCss(page)}
        onClick={() => this.clickListElement(page.visibleIndex)}>
        <div className={this.css.progressButtonsPageTitle}>
          {page.navigationTitle || page.name}
        </div>
        <div className={this.css.progressButtonsPageDescription}>
          {page.navigationDescription}
        </div>
      </li>
    );
  }
  protected getListElementCss(page: PageModel): string {
    return "";
  }
  protected clickListElement(index: number): void {
    this.survey.goToPage(index);
  }
}

ReactElementFactory.Instance.registerElement("survey-progress-buttons", (props) => {
  return React.createElement(SurveyProgressButtons, props);
});