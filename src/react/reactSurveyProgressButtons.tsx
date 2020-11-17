import * as React from "react";
import { SurveyNavigationBase } from "./reactSurveyNavigationBase";
import { ReactElementFactory } from "./element-factory";
import { PageModel } from "../page";
import { SurveyProgressButtonsModel } from '../surveyProgressButtons';

export class SurveyProgressButtons extends SurveyNavigationBase {
  private progressButtonsModel: SurveyProgressButtonsModel;
  private updateScroller: any = undefined;
  private listContainerRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.progressButtonsModel = new SurveyProgressButtonsModel(this.survey);
    this.listContainerRef = React.createRef();
  }
  render(): JSX.Element {
    return (
      <div className={this.css.progressButtonsContainerCenter}>
        <div className={this.css.progressButtonsContainer}>
          <div className={this.getScrollButtonCss(true)} role="button"
            onClick={() => this.clickScrollButton(this.listContainerRef.current, true)}></div>
          <div className={this.css.progressButtonsListContainer} ref={this.listContainerRef}>
            <ul className={this.css.progressButtonsList}>
              {this.getListElements()}
            </ul>
          </div>
          <div className={this.getScrollButtonCss(false)} role="button"
            onClick={() => this.clickScrollButton(this.listContainerRef.current, false)}></div>
        </div>
      </div>
    );
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
  protected getScrollButtonCss(isLeftScroll: boolean): string {
    let scrollCss: string = isLeftScroll ?
      this.survey.css.progressButtonsImageButtonLeft :
      this.survey.css.progressButtonsImageButtonRight;
    if (!this.state.hasScroller) scrollCss += " " + this.survey.css.progressButtonsImageButtonHidden;
    return scrollCss;
  }
  protected clickScrollButton(listContainerElement: Element, isLeftScroll: boolean): void {
    listContainerElement.scrollLeft += (isLeftScroll ? -1 : 1) * 70;
  }
  componentDidMount() {
    this.updateScroller = setInterval(() => {
      this.setState({ hasScroller: this.listContainerRef.current.scrollWidth >
        this.listContainerRef.current.offsetWidth});
    }, 100);
  }
  componentWillUnmount() {
    if (typeof this.updateScroller !== "undefined") {
      clearInterval(this.updateScroller);
      this.updateScroller = undefined;
    }
  }
}

ReactElementFactory.Instance.registerElement("survey-progress-buttons", (props) => {
  return React.createElement(SurveyProgressButtons, props);
});