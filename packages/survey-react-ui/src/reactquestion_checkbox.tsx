import * as React from "react";
import { SurveyQuestionCommentValueItem } from "./reactquestion_comment";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ItemValue, QuestionCheckboxModel } from "survey-core";
import { ReactElementFactory } from "./element-factory";
import { SurveyQuestionSelectBaseItem, SurveyQuestionSelectbase } from "./reactquestion_selectbase";

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
}
export class SurveyQuestionCheckboxItem extends SurveyQuestionSelectBaseItem {
  constructor(props: any) {
    super(props);
  }
  protected doOnItemChange(event: any): void {
    this.question.clickItemHandler(this.item, event.target.checked);
  }
  handleOnKeyDown = (event: any) => {
    this.question.onChoiceKeyDown(event.nativeEvent);
  };
  handleOnBlur = (event: any) => {
    this.question.onChoiceFocusOut(event.nativeEvent);
  };
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
    const itemLabel = !this.hideCaption ? <span className={this.cssClasses.controlLabel} id={this.question.getItemLabelId(this.item)} aria-hidden={this.question.isItemLabelAriaHidden ? "true" : undefined}>{this.renderLocString(this.item.locText, this.textStyle)}</span> : null;

    const shortcutKey = this.question.getChoiceKeyBadge(this.item);
    return (
      <div className={itemClass} role="presentation" ref={this.rootRef}>
        <label className={labelClass}>
          {shortcutKey ? <span className={this.question.getItemShortcutKeyClass(this.item)} aria-hidden="true">{shortcutKey}</span> : null}
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
            onKeyDown={this.handleOnKeyDown}
            onBlur={this.handleOnBlur}
            required={this.question.hasRequiredError()}
            aria-label={this.ariaLabel}
            aria-labelledby={!this.ariaLabel && !this.hideCaption ? this.question.getItemLabelId(this.item) : undefined}
            aria-keyshortcuts={this.question.getItemAriaKeyShortcuts(this.item)}
          />
          {
            this.cssClasses.materialDecorator ?
              <span className={this.cssClasses.materialDecorator} aria-hidden="true">
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
