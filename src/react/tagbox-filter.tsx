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
      const newValue = this.model.filterString;
      if (!Helpers.isTwoValueEquals(newValue, control.value)) {
        control.value = this.model.filterString;
      }
    }
  }
  onChange(e: any) {
    if (e.target === document.activeElement) {
      this.model.filterString = e.target.value;
    }
  }
  keyhandler(e: any) {
    this.model.inputKeyHandler(e);
  }
  onBlur(e: any) {
    this.model.onBlur(e);
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
      ref={(element) => (this.inputElement = element)}
      className={this.question.cssClasses.filterStringInput}
      disabled={this.question.isInputReadOnly}
      readOnly={!this.model.searchEnabled ? true : undefined}
      size={!this.model.filterString ? 1 : undefined}
      role={ this.model.filterStringEnabled ? this.question.ariaRole : undefined }
      aria-label={this.question.placeholder}
      placeholder={this.model.filterStringPlaceholder}
      onKeyDown={(e) => { this.keyhandler(e); }}
      onChange={(e) => { this.onChange(e); }}
      onBlur={(e) => { this.onBlur(e); }}
    ></input>);
  }
}

ReactQuestionFactory.Instance.registerQuestion("sv-tagbox-filter", (props) => {
  return React.createElement(TagboxFilterString, props);
});