import React from "react";
import { Helpers, TextAreaViewModel } from "survey-core";
import { ReactElementFactory } from "../element-factory";
import { SurveyElementBase } from "../reactquestion_element";

interface ITextAreaProps {
  viewModelOptions: TextAreaViewModel;
}

export class TextAreaComponent extends SurveyElementBase<ITextAreaProps, any> {
  private control: HTMLElement;

  constructor(props: ITextAreaProps) {
    super(props);
    this.state = { comment: this.viewModel.getTextValue() || "" };
  }
  get viewModel(): TextAreaViewModel {
    return this.props.viewModelOptions;
  }
  componentDidUpdate(prevProps: any, prevState: any): void {
    super.componentDidUpdate(prevProps, prevState);
    this.updateDomElement();
  }
  componentDidMount(): void {
    super.componentDidMount();
    this.updateDomElement();
  }
  protected updateDomElement(): void {
    if (!!this.control) {
      const control: any = this.control;
      const newValue = this.viewModel.getTextValue() || "";
      if (!Helpers.isTwoValueEquals(newValue, control.value, false, true, false)) {
        control.value = newValue;
      }
    }
  }
  protected setControl(element: HTMLElement | null): void {
    if(!!element) {
      this.control = element;
    }
  }
  protected canRender(): boolean {
    return !!this.viewModel.question;
  }

  protected renderElement(): JSX.Element {
    return (
      <textarea
        id={this.viewModel.id}
        className={this.viewModel.className}
        ref={(textarea) => (this.setControl(textarea))}
        disabled={this.viewModel.isDisabledAttr}
        readOnly={this.viewModel.isReadOnlyAttr}
        rows={this.viewModel.rows}
        cols={this.viewModel.cols}
        placeholder={this.viewModel.placeholder}
        maxLength={this.viewModel.maxLength}
        onBlur={this.viewModel.onTextAreaChange}
        onInput={this.viewModel.onTextAreaInput}
        onKeyDown={this.viewModel.onTextAreaKeyDown}
        aria-required={this.viewModel.ariaRequired}
        aria-label={this.viewModel.ariaLabel}

        aria-labelledby={this.viewModel.ariaLabelledBy}
        aria-describedby={this.viewModel.ariaDescribedBy}
        aria-invalid={this.viewModel.ariaInvalid}
        aria-errormessage={this.viewModel.ariaErrormessage}
        style={{ resize: this.viewModel.question.resizeStyle }}
      />
    );
  }

}

ReactElementFactory.Instance.registerElement("sv-textarea", (props) => {
  return React.createElement(TextAreaComponent, props);
});