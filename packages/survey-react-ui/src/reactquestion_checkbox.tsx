import * as React from "react";
import { SurveyQuestionCommentValueItem } from "./reactquestion_comment";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ItemValue, QuestionCheckboxModel } from "survey-core";
import { ReactElementFactory } from "./element-factory";
import { SurveyQuestionCheckboxBaseItem, SurveyQuestionSelectbase } from "./reactquestion_checkboxbase";

export class SurveyQuestionCheckbox extends SurveyQuestionSelectbase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionCheckboxModel {
    return this.questionBase as QuestionCheckboxModel;
  }
  protected renderHeader(): React.JSX.Element | null {
    return <>
      <legend className={"sv-hidden"}>{this.question.locTitle.renderedHtml}</legend>
      {this.getHeader()}
    </>;
  }
  protected getHeader() {
    if (this.question.hasHeadItems) {
      return this.question.headItems.map((item: any, ii: number) =>
        this.renderItem(
          item,
          false,
          this.question.cssClasses
        )
      );
    }
    return null;
  }
  protected getItems(cssClasses: any, choices: Array<ItemValue>): Array<any> {
    var renderedItems: Array<React.JSX.Element> = [];
    for (var i = 0; i < choices.length; i++) {
      var item = choices[i];
      var renderedItem = this.renderItem(item, i == 0, cssClasses, "" + i);
      if (!!renderedItem) {
        renderedItems.push(renderedItem);
      }
    }
    return renderedItems;
  }
}
export class SurveyQuestionCheckboxItem extends SurveyQuestionCheckboxBaseItem {
  constructor(props: any) {
    super(props);
  }
  protected doOnItemChange(event: any): void {
    this.question.clickItemHandler(this.item, event.target.checked);
  }
  protected renderElementContent(): React.JSX.Element {
    const isChecked = this.question.isItemSelected(this.item);
    return this.renderCheckbox(isChecked);
  }
  protected get inputStyle(): any {
    return null;//{ marginRight: "3px" };
  }
  protected renderCheckbox(isChecked: boolean): React.JSX.Element {
    const id = this.question.getItemId(this.item);
    const itemClass = this.question.getItemClass(this.item);
    const labelClass = this.question.getLabelClass(this.item);
    const itemLabel = !this.hideCaption ? <span className={this.cssClasses.controlLabel}>{this.renderLocString(this.item.locText, this.textStyle)}</span> : null;

    return (
      <div className={itemClass} role="presentation" ref={this.rootRef}>
        <label className={labelClass}>
          <input
            className={this.cssClasses.itemControl}
            type="checkbox"
            name={this.question.name + this.item.id}
            value={this.item.value}
            id={id}
            style={this.inputStyle}
            disabled={!this.question.getItemEnabled(this.item)}
            readOnly={this.question.isReadOnlyAttr}
            checked={isChecked}
            onChange={this.handleOnChange}
            required={this.question.hasRequiredError()}
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

ReactElementFactory.Instance.registerElement("survey-checkbox-item", (props: any) => {
  return React.createElement(SurveyQuestionCheckboxItem, props);
});

ReactQuestionFactory.Instance.registerQuestion("checkbox", (props) => {
  return React.createElement(SurveyQuestionCheckbox, props);
});
