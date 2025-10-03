import * as React from "react";
import { QuestionRadiogroupModel, ItemValue, Base, SurveyModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ReactElementFactory } from "./element-factory";
import { SurveyQuestionSelectBaseItem, SurveyQuestionSelectbase } from "./reactquestion_selectbase";

export class SurveyQuestionRadiogroup extends SurveyQuestionSelectbase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionRadiogroupModel {
    return this.questionBase as QuestionRadiogroupModel;
  }
  protected getFooter(): React.JSX.Element | null {
    return <>
      {super.getFooter()}
      {this.renderClearButton()}
    </>;
  }
  private renderClearButton(): React.JSX.Element | null {
    if (!this.question.showClearButtonInContent) return null;
    return (
      <div>
        <input
          type="button"
          className={this.question.cssClasses.clearButton}
          onClick={() => this.question.clearValueFromUI()}
          value={this.question.clearButtonCaption}
        />
      </div>
    );
  }
  protected getStateValue(): any {
    return !this.question.isEmpty() ? this.question.renderedValue : "";
  }
  protected isItemChecked(item: ItemValue, value: any): boolean { return item.value === value; }
}

export class SurveyQuestionRadioItem extends SurveyQuestionSelectBaseItem {
  constructor(props: any) {
    super(props);
    this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
  }
  protected getStateElement(): Base {
    return this.item;
  }
  protected get question(): QuestionRadiogroupModel {
    return this.props.question;
  }
  protected get isChecked(): boolean {
    return this.props.isChecked;
  }
  protected doOnItemChange(event: any): void {
    this.question.clickItemHandler(this.item);
  }
  handleOnMouseDown(event: any) {
    this.question.onMouseDown();
  }
  protected renderElementContent(): React.JSX.Element {
    return this.renderRadioButton();
  }
  protected renderRadioButton(): React.JSX.Element {
    var itemClass = this.question.getItemClass(this.item);
    var labelClass = this.question.getLabelClass(this.item);
    var controlLabelClass = this.question.getControlLabelClass(this.item);
    const itemLabel = !this.hideCaption ? <span className={controlLabelClass}>{this.renderLocString(this.item.locText, this.textStyle)}</span> : null;
    return (
      <div
        className={itemClass}
        role="presentation"
        ref={this.rootRef}
      >
        <label onMouseDown={this.handleOnMouseDown} className={labelClass}>
          <input
            aria-errormessage={this.question.ariaErrormessage}
            className={this.cssClasses.itemControl}
            id={this.question.getItemId(this.item)}
            type="radio"
            name={this.question.questionName}
            checked={this.isChecked}
            value={this.item.value}
            disabled={!this.question.getItemEnabled(this.item)}
            readOnly={this.question.isReadOnlyAttr}
            onChange={this.handleOnChange}
            aria-label={this.ariaLabel}
          />
          {
            this.cssClasses.materialDecorator ?
              <span className={this.cssClasses.materialDecorator}>
                {this.question.itemSvgIcon ?
                  <svg
                    className={this.cssClasses.itemDecorator}
                  >
                    <use xlinkHref={this.question.itemSvgIcon}></use>
                  </svg> :
                  null
                }
              </span> :
              null
          }
          {itemLabel}
        </label>
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("survey-radiogroup-item", (props: any) => {
  return React.createElement(SurveyQuestionRadioItem, props);
});

ReactQuestionFactory.Instance.registerQuestion("radiogroup", (props) => {
  return React.createElement(SurveyQuestionRadiogroup, props);
});
