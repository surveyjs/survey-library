import * as React from "react";
import { DropdownMultiSelectListModel, QuestionTagboxModel, Helpers } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyElementBase } from "./reactquestion_element";

interface ITagboxFilterProps {
  model: DropdownMultiSelectListModel;
  question: QuestionTagboxModel;
}

export class TagboxFilterString extends SurveyElementBase<ITagboxFilterProps, any> {
  inputElement: HTMLInputElement | null;

  get model(): DropdownMultiSelectListModel {
    return this.props.model;
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
      const newValue = this.model.inputStringRendered;
      if (!Helpers.isTwoValueEquals(newValue, control.value)) {
        control.value = this.model.inputStringRendered;
      }
    }
  }
  onChange(e: any) {
    if (e.target === document.activeElement) {
      this.model.inputStringRendered = e.target.value;
    }
  }
  keyhandler(e: any) {
    this.model.inputKeyHandler(e);
  }
  onBlur(e: any) {
    this.model.onBlur(e);
  }
  onFocus(e: any) {
    this.model.onFocus(e);
  }
  constructor(props: any) {
    super(props);
  }
  getStateElement() {
    return this.model;
  }
  render(): JSX.Element {
    return (<input type="text" autoComplete="off"
      id={this.question.getInputId()}
      inputMode={this.model.inputMode}
      ref={(element) => (this.inputElement = element)}
      className={this.question.cssClasses.filterStringInput}
      disabled={this.question.isInputReadOnly}
      readOnly={!this.model.searchEnabled ? true : undefined}
      size={!this.model.inputStringRendered ? 1 : undefined}
      role={ this.model.filterStringEnabled ? this.question.ariaRole : undefined }
      aria-label={this.question.placeholder}
      aria-expanded={this.question.ariaExpanded ? "true" : "false"}
      aria-controls={this.model.listElementId}
      aria-activedescendant={this.model.ariaActivedescendant}
      placeholder={this.model.filterStringPlaceholder}
      onKeyDown={(e) => { this.keyhandler(e); }}
      onChange={(e) => { this.onChange(e); }}
      onBlur={(e) => { this.onBlur(e); }}
      onFocus={(e) => { this.onFocus(e); }}
    ></input>);
  }
}

ReactQuestionFactory.Instance.registerQuestion("sv-tagbox-filter", (props) => {
  return React.createElement(TagboxFilterString, props);
});