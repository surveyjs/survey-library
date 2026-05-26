import * as React from "react";
import { ProgressButtons, PageModel, ProgressButtonsResponsivityManager, IProgressButtonsViewModel, Base } from "survey-core";
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
  protected getStateElement(): Base | null {
    return this.model;
  }
  onResize(canShowItemTitles: boolean): void {
    // this.setState({ canShowItemTitles });
    // this.setState({ canShowHeader: !canShowItemTitles });
  }
  onUpdateScroller(hasScroller: boolean): void {
    //this.setState({ hasScroller });
  }
  onUpdateSettings(): void {
    this.setState({ canShowItemTitles: this.model.showItemTitles });
    this.setState({ canShowFooter: !this.model.showItemTitles });
  }
  render(): React.JSX.Element {
    return (
      <div className={this.model.getRootCss(this.props.container)} style={{ "maxWidth": this.model.progressWidth, ["--sd-progress-buttons-pages-count" as any]: this.model.visiblePages.length }}
        role="tablist" aria-label={this.model.progressBarAriaLabel}
        onKeyDown={(event) => this.model.onKeyDown(event.nativeEvent)}
      >
        {/* {this.state.canShowHeader ? <div className={this.css.progressButtonsHeader}>
          <div className={this.css.progressButtonsPageTitle} title={this.model.headerText}>{this.model.headerText}</div>
        </div> : null} */}
        <div className={this.css.progressButtonsContainer}>
          <div
            className={this.css.progressButtonsListContainer}
            ref={this.listContainerRef}
          >
            <ul className={this.css.progressButtonsList}>
              {this.getListElements()}
            </ul>
          </div>
        </div>
        {/* {this.state.canShowFooter ? <div className={this.css.progressButtonsFooter}>
          <div className={this.css.progressButtonsPageTitle} title={this.model.footerText}>{this.model.footerText}</div>
        </div> : null} */}
      </div>
    );
  }
  protected getListElements(): React.JSX.Element[] {
    let buttons: React.JSX.Element[] = [];
    this.model.visiblePages.forEach((page: PageModel, index: number) => {
      buttons.push(this.renderListElement(page, index));
    });
    return buttons;
  }
  protected renderListElement(page: PageModel, index: number): React.JSX.Element {
    const text = SurveyElementBase.renderLocString(page.locNavigationTitle);
    const onClickHandler = this.model.isListElementClickable(index) ? () => this.model.clickListElement(page) : undefined;
    return (
      <li
        key={"listelement" + page.uniqueId}
        className={this.model.getListElementCss(index)}
        data-page-number={this.model.getItemNumber(page)}
        role="presentation"
      >
        {
          this.model.showItemTitles ? <div
            className={this.css.progressButtonsPageTitle}
            title={page.renderedNavigationTitle}
            onClick={onClickHandler}
          >
            {text}
          </div> : null
        }
        {
          this.model.showItemDescriptions ? <div
            className={this.css.progressButtonsPageDescription}
            title={page.navigationDescription}
            onClick={onClickHandler}
          >
            {page.navigationDescription}
          </div> : null
        }

        <button className={this.css.progressButtonsButton}
          onClick={onClickHandler}
          role="tab"
          aria-selected={this.model.isPageSelected(index)}
          aria-label={this.model.getButtonAriaLabel(page)}
          tabIndex={this.model.getTabIndex(index)}
          data-page-index={index}
        >
          {
            this.model.showItemNumbers ?
              this.model.getItemNumber(page) :
              this.model.isListElementPassed(index) ?
                <svg className={this.css.progressButtonsCheckIcon}>
                  <use xlinkHref={`#icon-${this.css.progressButtonsCheckIconId}`}></use>
                </svg> :
                <div className={this.css.progressButtonsDot}></div>
          }
        </button>
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
    this.respManager = new ProgressButtonsResponsivityManager(this.model, this.listContainerRef.current as any, this);
  }
  componentWillUnmount() {
    if (!!this.respManager) {
      this.respManager.dispose();
    }
    super.componentWillUnmount();
  }
}

ReactElementFactory.Instance.registerElement("sv-progress-buttons", (props) => {
  return React.createElement(SurveyProgressButtons, props);
});
