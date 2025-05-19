import * as React from "react";
import { QuestionTagboxModel, DropdownListModel, DropdownMultiSelectListModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionDropdownBase } from "./dropdown-base";
import { SurveyQuestionTagboxItem } from "./tagbox-item";
import { TagboxFilterString } from "./tagbox-filter";
import { SurveyActionBar } from "./components/action-bar/action-bar";

export class SurveyQuestionTagbox extends SurveyQuestionDropdownBase<QuestionTagboxModel> {
  constructor(props: any) {
    super(props);
  }

  protected renderItem(key: string, item: any): React.JSX.Element {
    const renderedItem = (
      <SurveyQuestionTagboxItem
        key={key}
        question={this.question}
        item={item}
      />
    );
    return renderedItem;
  }

  protected renderInput(dropdownListModel: DropdownListModel): React.JSX.Element {
    const dropdownMultiSelectListModel = dropdownListModel as DropdownMultiSelectListModel;
    const items = this.question.selectedChoices.map((choice, index) => { return this.renderItem("item" + index, choice); });
    return (
      <div
        id={this.question.inputId}
        className={this.question.getControlClass()}
        tabIndex={dropdownListModel.noTabIndex ? undefined : 0}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        disabled={this.question.isInputReadOnly}
        required={this.question.isRequired}
        onKeyDown={this.keyhandler}
        onBlur={this.blur}
        role={dropdownListModel.ariaQuestionRole}
        aria-required={dropdownListModel.ariaQuestionRequired}
        aria-invalid={dropdownListModel.ariaQuestionInvalid}
        aria-errormessage={dropdownListModel.ariaQuestionErrorMessage}
        aria-label={dropdownListModel.ariaQuestionLabel}
        aria-labelledby={dropdownListModel.ariaQuestionLabelledby}
        aria-describedby={dropdownListModel.ariaQuestionDescribedby}
        aria-expanded={dropdownListModel.ariaQuestionExpanded}
        aria-controls={dropdownListModel.ariaQuestionControls}
        aria-activedescendant={dropdownListModel.ariaQuestionActivedescendant}
        ref={(div) => (this.setControl(div))}
      >
        <div className={this.question.cssClasses.controlValue}>
          {items}
          <TagboxFilterString model={dropdownMultiSelectListModel} question={this.question}></TagboxFilterString>
        </div>
        {/* {this.createClearButton()} */}
        <SurveyActionBar model={dropdownListModel.editorButtons}></SurveyActionBar>
      </div>);
  }

  protected renderElement(): React.JSX.Element {
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

  protected renderReadOnlyElement(): React.JSX.Element | null {
    if (this.question.locReadOnlyText) {
      return this.renderLocString(this.question.locReadOnlyText);
    } else {
      return null;
    }
  }
}

ReactQuestionFactory.Instance.registerQuestion("tagbox", (props) => {
  return React.createElement(SurveyQuestionTagbox, props);
});