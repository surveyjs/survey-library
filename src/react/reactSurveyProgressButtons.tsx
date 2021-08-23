import * as React from "react";
import { SurveyProgressButtonsModel, PageModel } from "survey-core";
import { SurveyNavigationBase } from "./reactSurveyNavigationBase";
import { ReactElementFactory } from "./element-factory";

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
          <div
            className={this.getScrollButtonCss(true)}
            role="button"
            onClick={() =>
              this.clickScrollButton(this.listContainerRef.current, true)
            }
          ></div>
          <div
            className={this.css.progressButtonsListContainer}
            ref={this.listContainerRef}
          >
            <ul className={this.css.progressButtonsList}>
              {this.getListElements()}
            </ul>
          </div>
          <div
            className={this.getScrollButtonCss(false)}
            role="button"
            onClick={() =>
              this.clickScrollButton(this.listContainerRef.current, false)
            }
          ></div>
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
      <li
        key={"listelement" + index}
        className={this.getListElementCss(index)}
        onClick={
          this.isListElementClickable(index)
            ? () => this.clickListElement(index)
            : undefined
        }
      >
        <div
          className={this.css.progressButtonsPageTitle}
          title={page.navigationTitle || page.name}
        >
          {page.navigationTitle || page.name}
        </div>
        <div
          className={this.css.progressButtonsPageDescription}
          title={page.navigationDescription}
        >
          {page.navigationDescription}
        </div>
      </li>
    );
  }
  protected isListElementClickable(index: number): boolean {
    return this.progressButtonsModel.isListElementClickable(index);
  }
  protected getListElementCss(index: number): string {
    return this.progressButtonsModel.getListElementCss(index);
  }
  protected clickListElement(index: number): void {
    this.progressButtonsModel.clickListElement(index);
  }
  protected getScrollButtonCss(isLeftScroll: boolean): string {
    return this.progressButtonsModel.getScrollButtonCss(this.state.hasScroller, isLeftScroll);
  }
  protected clickScrollButton(
    listContainerElement: Element,
    isLeftScroll: boolean
  ): void {
    listContainerElement.scrollLeft += (isLeftScroll ? -1 : 1) * 70;
  }
  componentDidMount() {
    this.updateScroller = setInterval(() => {
      this.setState({
        hasScroller:
          this.listContainerRef.current.scrollWidth >
          this.listContainerRef.current.offsetWidth,
      });
    }, 100);
  }
  componentWillUnmount() {
    if (typeof this.updateScroller !== "undefined") {
      clearInterval(this.updateScroller);
      this.updateScroller = undefined;
    }
  }
}

ReactElementFactory.Instance.registerElement("sv-progress-buttons", (props) => {
  return React.createElement(SurveyProgressButtons, props);
});
