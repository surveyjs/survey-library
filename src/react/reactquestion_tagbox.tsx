import * as React from "react";
import { QuestionTagboxModel, DropdownListModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionDropdownBase } from "./dropdown-base";
import { SurveyQuestionTagboxItem } from "./tagbox-item";
import { DropdownFilter } from "./dropdown-filter";

export class SurveyQuestionTagbox extends SurveyQuestionDropdownBase<QuestionTagboxModel> {
  constructor(props: any) {
    super(props);
  }

  protected renderItem(key: string, item: any): JSX.Element {
    const renderedItem = (
      <SurveyQuestionTagboxItem
        key={key}
        question={this.question}
        item={item}
      />
    );
    return renderedItem;
  }

  protected renderInput(dropdownListModel: DropdownListModel): JSX.Element {
    const isEmpty = this.question.selectedItems.length === 0;
    const items = this.question.selectedItems.map((choice, index) => { return this.renderItem("item" + index, choice); });
    return (
      <div
        id={this.question.inputId}
        className={this.question.getControlClass()}
        tabIndex={(this.question.isInputReadOnly || dropdownListModel.searchEnabled) ? undefined : 0}
        onClick={this.click}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        disabled={this.question.isInputReadOnly}
        required={this.question.isRequired}
        onKeyUp={this.keyup}
        onBlur={this.blur}
        role={this.question.ariaRole}
        aria-required={this.question.ariaRequired}
        aria-label={this.question.ariaLabel}
        aria-invalid={this.question.ariaInvalid}
        aria-describedby={this.question.ariaDescribedBy}
      >
        <div className={this.question.cssClasses.controlValue}>
          {items}
          <DropdownFilter model={dropdownListModel} cssClasses={this.question.cssClasses} ></DropdownFilter>
          {(isEmpty && !dropdownListModel.filterString) ?
            (<div className={this.question.cssClasses.placeholderInput}>{this.question.placeholder}</div>) :
            (null) }
        </div>
        {this.createClearButton()}
      </div>);
  }

  protected renderElement(): JSX.Element {
    const cssClasses = this.question.cssClasses;
    const comment = this.question.isOtherSelected ? this.renderOther(cssClasses) : null;
    const select = this.renderSelect(cssClasses);
    return (
      <div className={this.question.renderCssRoot}>
        {select}
        {comment}
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("tagbox", (props) => {
  return React.createElement(SurveyQuestionTagbox, props);
});