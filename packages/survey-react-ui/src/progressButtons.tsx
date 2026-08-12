import * as React from "react";
import { ProgressButtons, PageModel, Base } from "survey-core";
import { SurveyNavigationBase } from "./reactSurveyNavigationBase";
import { ReactElementFactory } from "./element-factory";
import { SurveyElementBase } from "./reactquestion_element";

export class SurveyProgressButtons extends SurveyNavigationBase {
  constructor(props: any) {
    super(props);
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
  render(): React.JSX.Element {
    return (
      <div className={this.model.getRootCss(this.props.container)} style={{ "maxWidth": this.model.progressWidth }}
        role="tablist" aria-label={this.model.progressBarAriaLabel}
        onKeyDown={(event) => this.model.onKeyDown(event.nativeEvent)}
      >
        <div className={this.css.progressButtonsContainer} role="presentation">
          <div
            className={this.css.progressButtonsListContainer}
            role="presentation"
          >
            <ul className={this.css.progressButtonsList} role="presentation">
              {this.getListElements()}
            </ul>
          </div>
        </div>
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
        key={page.uniqueId}
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
          type="button"
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
}

ReactElementFactory.Instance.registerElement("sv-progress-buttons", (props) => {
  return React.createElement(SurveyProgressButtons, props);
});
