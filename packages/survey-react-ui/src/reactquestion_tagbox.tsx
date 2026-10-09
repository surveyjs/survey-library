import * as React from "react";
import { QuestionTagboxModel, DropdownMultiSelectRenderState } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionDropdownBase } from "./dropdown-base";
import { SurveyQuestionTagboxItem } from "./tagbox-item";
import { TagboxFilterString } from "./tagbox-filter";

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

  protected renderInput(): React.JSX.Element {
    const renderState = this.renderState as DropdownMultiSelectRenderState;
    const items = this.question.selectedChoices.map((choice, index) => { return this.renderItem("item" + index, choice); });

    return (
      <div
        id={this.question.inputId}
        className={this.question.getControlClass()}
        tabIndex={renderState.noTabIndex ? undefined : 0}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        disabled={this.question.isInputReadOnly}
        required={this.question.isRequired}
        onKeyDown={this.keyhandler}
        onBlur={this.blur}
        role={renderState.ariaQuestionRole}
        aria-required={renderState.ariaQuestionRequired}
        aria-invalid={renderState.ariaQuestionInvalid}
        aria-errormessage={renderState.ariaQuestionErrorMessage}
        aria-label={renderState.ariaQuestionLabel}
        aria-labelledby={renderState.ariaQuestionLabelledby}
        aria-describedby={renderState.ariaQuestionDescribedby}
        aria-expanded={renderState.ariaQuestionExpanded}
        aria-controls={renderState.ariaQuestionControls}
        aria-activedescendant={renderState.ariaQuestionActivedescendant}
        ref={(div) => (this.setControl(div))}
      >
        <div className={this.question.cssClasses.controlValue}>
          {items}
          {renderState.needRenderInput ? <TagboxFilterString question={this.question}></TagboxFilterString> : null}
        </div>
        {this.renderEditorButtons()}
      </div>);
  }

  protected renderElement(): React.JSX.Element {
    const cssClasses = this.question.cssClasses;
    const comment = this.renderOther(this.question.otherItem, cssClasses);
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