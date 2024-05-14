import * as React from "react";
import { ProgressButtons, PageModel, ProgressButtonsResponsivityManager, IProgressButtonsViewModel } from "survey-core";
import { SurveyNavigationBase } from "./reactSurveyNavigationBase";
import { ReactElementFactory } from "./element-factory";
import { SurveyElementBase } from "./reactquestion_element";

export class SurveyProgressButtons extends SurveyNavigationBase implements IProgressButtonsViewModel {
  private respManager: ProgressButtonsResponsivityManager;
  private listContainerRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.listContainerRef = React.createRef();
  }
  protected get model(): ProgressButtons {
    return this.props.model;
  }
  get container(): string {
    return this.props.container;
  }
  onResize(canShowItemTitles: boolean): void {
    this.setState({ canShowItemTitles });
    this.setState({ canShowHeader: !canShowItemTitles });
  }
  onUpdateScroller(hasScroller: boolean): void {
    this.setState({ hasScroller });
  }
  onUpdateSettings(): void {
    this.setState({ canShowItemTitles: this.model.showItemTitles });
    this.setState({ canShowFooter: !this.model.showItemTitles });
  }
  render(): JSX.Element {
    return (
      <div className={this.model.getRootCss(this.props.container)} style={{ "maxWidth": this.model.progressWidth }} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-label="progress">
        {this.state.canShowHeader ? <div className={this.css.progressButtonsHeader}>
          <div className={this.css.progressButtonsPageTitle} title={this.model.headerText}>{this.model.headerText}</div>
        </div> : null}
        <div className={this.css.progressButtonsContainer}>
          <div
            className={this.model.getScrollButtonCss(this.state.hasScroller, true)}
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
            className={this.model.getScrollButtonCss(this.state.hasScroller, false)}
            role="button"
            onClick={() =>
              this.clickScrollButton(this.listContainerRef.current, false)
            }
          ></div>
        </div>
        {this.state.canShowFooter ? <div className={this.css.progressButtonsFooter}>
          <div className={this.css.progressButtonsPageTitle} title={this.model.footerText}>{this.model.footerText}</div>
        </div> : null}
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
    const text = SurveyElementBase.renderLocString(page.locNavigationTitle);
    return (
      <li
        key={"listelement" + index}
        className={this.model.getListElementCss(index)}
        onClick={
          this.model.isListElementClickable(index)
            ? () => this.model.clickListElement(page)
            : undefined
        }
        data-page-number={this.model.getItemNumber(page)}
      >
        <div className={this.css.progressButtonsConnector}></div>
        {this.state.canShowItemTitles ? <>
          <div
            className={this.css.progressButtonsPageTitle}
            title={page.renderedNavigationTitle}
          >
            {text}
          </div>
          <div
            className={this.css.progressButtonsPageDescription}
            title={page.navigationDescription}
          >
            {page.navigationDescription}
          </div>
        </> : null}
        <div className={this.css.progressButtonsButton}><div className={this.css.progressButtonsButtonBackground}></div><div className={this.css.progressButtonsButtonContent}></div><span>{this.model.getItemNumber(page)}</span></div>
      </li>
    );
  }
  protected clickScrollButton(
    listContainerElement: Element | null,
    isLeftScroll: boolean
  ): void {
    if (!!listContainerElement) {
      listContainerElement.scrollLeft += (isLeftScroll ? -1 : 1) * 70;
    }
  }
  componentDidMount() {
    super.componentDidMount();
    setTimeout(() => {
      this.respManager = new ProgressButtonsResponsivityManager(this.model, this.listContainerRef.current as any, this);
    }, 10);
  }
  componentWillUnmount() {
    if(!!this.respManager) {
      this.respManager.dispose();
    }
    super.componentWillUnmount();
  }
}

ReactElementFactory.Instance.registerElement("sv-progress-buttons", (props) => {
  return React.createElement(SurveyProgressButtons, props);
});
