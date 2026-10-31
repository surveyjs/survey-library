import * as React from "react";
import { Base, DropdownMultiSelectListModel, DropdownMultiSelectRenderState, QuestionTagboxModel, Helpers, settings } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyElementBase } from "./reactquestion_element";

interface ITagboxFilterProps {
  model?: DropdownMultiSelectListModel;
  question: QuestionTagboxModel;
}

export class TagboxFilterString extends SurveyElementBase<ITagboxFilterProps, any> {
  inputElement: HTMLInputElement | null;

  // Creates the model: used by the event handlers only.
  get model(): DropdownMultiSelectListModel {
    return this.props.model || this.question.dropdownListModel;
  }
  protected get renderState(): DropdownMultiSelectRenderState {
    return (this.props.model as any) || this.question.dropdownRenderState;
  }
  get question(): QuestionTagboxModel {
    return this.props.question;
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    this.updateDomElement();
  }
  componentDidMount() {
    super.componentDidMount();
    this.updateDomElement();
  }
  updateDomElement() {
    if (!!this.inputElement) {
      const control: any = this.inputElement;
      const newValue = this.renderState.inputStringRendered;
      if (!Helpers.isTwoValueEquals(newValue, control.value, false, true, false)) {
        control.value = this.renderState.inputStringRendered;
      }
    }
  }
  onChange(e: any) {
    const activeElement = e.target.getRootNode()?.activeElement;
    if (e.target === activeElement) {
      this.model.inputStringRendered = e.target.value;
    }
  }
  keyhandler(e: any) {
    this.model.inputKeyHandler(e);
  }
  onBlur(e: any) {
    this.question.onBlur(e);
  }
  onFocus(e: any) {
    this.question.onFocus(e);
  }
  constructor(props: any) {
    super(props);
  }
  getStateElement(): Base {
    return this.props.model || this.question.dropdownListModelValue;
  }
  render(): React.JSX.Element {
    return (
      <div className={this.question.cssClasses.hint}>
        {this.renderState.showHintPrefix ?
          (<div className={this.question.cssClasses.hintPrefix}>
            <span>{this.renderState.hintStringPrefix}</span>
          </div>) : null}
        <div className={this.question.cssClasses.hintSuffixWrapper}>
          {this.renderState.showHintString ?
            (<div className={this.question.cssClasses.hintSuffix}>
              <span style={{ visibility: "hidden" }} data-bind="text: model.filterString">{this.renderState.inputStringRendered}</span>
              <span>{this.renderState.hintStringSuffix}</span>
            </div>) : null}

          <input type="text" autoComplete="off"
            id={this.question.getInputId()}
            inputMode={this.renderState.inputMode}
            ref={(element) => (this.inputElement = element)}
            className={this.question.cssClasses.filterStringInput}
            disabled={this.question.isInputReadOnly}
            readOnly={this.renderState.filterReadOnly ? true : undefined}
            size={!this.renderState.inputStringRendered ? 1 : undefined}
            role={this.renderState.ariaInputRole}
            aria-required={this.renderState.ariaInputRequired}
            aria-invalid={this.renderState.ariaInputInvalid}
            aria-errormessage={this.renderState.ariaInputErrorMessage}
            aria-expanded={this.renderState.ariaInputExpanded}
            aria-label={this.renderState.ariaInputLabel}
            aria-labelledby={this.renderState.ariaInputLabelledby}
            aria-describedby={this.renderState.ariaInputDescribedby}
            aria-controls={this.renderState.ariaInputControls}
            aria-activedescendant={this.renderState.ariaInputActivedescendant}
            placeholder={this.renderState.filterStringPlaceholder}
            onKeyDown={(e) => { this.keyhandler(e); }}
            onChange={(e) => { this.onChange(e); }}
            onBlur={(e) => { this.onBlur(e); }}
            onFocus={(e) => { this.onFocus(e); }}
          ></input>
        </div>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("sv-tagbox-filter", (props) => {
  return React.createElement(TagboxFilterString, props);
});