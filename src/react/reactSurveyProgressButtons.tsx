import * as React from "react";
import { SurveyNavigationBase } from "./reactSurveyNavigationBase";
import { ReactElementFactory } from "./element-factory";
import { PageModel } from "../page";
import { SurveyProgressButtonsModel } from '../surveyProgressButtons';

export class SurveyProgressButtons extends SurveyNavigationBase {
  private progressButtonsModel: SurveyProgressButtonsModel;
  constructor(props: any) {
    super(props);
    this.progressButtonsModel = new SurveyProgressButtonsModel(this.survey);
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
    this.survey.visiblePages.forEach((page: PageModel, index: number) => {
      buttons.push(this.renderListElement(page, index));
    });
    return buttons;
  }
  protected renderListElement(page: PageModel, index: number): JSX.Element {
    return (
      <li key={"listelement" + index} className={this.getListElementCss(index)}
        onClick={() => this.clickListElement(index)}>
        <div className={this.css.progressButtonsPageTitle}>
          {page.navigationTitle || page.name}
        </div>
        <div className={this.css.progressButtonsPageDescription}>
          {page.navigationDescription}
        </div>
      </li>
    );
  }
  protected getListElementCss(index: number): string {
    return this.progressButtonsModel.getListElementCss(index);
  }
  protected clickListElement(index: number): void {
    this.progressButtonsModel.clickListElement(index);
  }
}

ReactElementFactory.Instance.registerElement("survey-progress-buttons", (props) => {
  return React.createElement(SurveyProgressButtons, props);
});