import * as React from "react";
import { TextAreaModel } from "survey-core";
import { ReactElementFactory } from "../element-factory";
import { SurveyElementBase } from "../reactquestion_element";

interface ITextAreaProps {
  viewModel: TextAreaModel;
}

export class TextAreaComponent extends SurveyElementBase<ITextAreaProps, any> {
  private textareaRef: React.RefObject<HTMLTextAreaElement>;
  private initialValue;

  constructor(props: ITextAreaProps) {
    super(props);
    this.initialValue = this.viewModel.getTextValue() || "";
    this.textareaRef = React.createRef();
  }
  get viewModel(): TextAreaModel {
    return this.props.viewModel;
  }
  protected canRender(): boolean {
    return !!this.viewModel.question;
  }

  componentDidMount() {
    super.componentDidMount();
    let el = this.textareaRef.current;
    if (!!el) {
      this.viewModel.setElement(el);
    }
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    this.viewModel.resetElement();
  }

  protected renderElement(): React.JSX.Element {
    return (
      <textarea
        id={this.viewModel.id}
        className={this.viewModel.className}
        ref={this.textareaRef}
        disabled={this.viewModel.isDisabledAttr}
        readOnly={this.viewModel.isReadOnlyAttr}
        rows={this.viewModel.rows}
        cols={this.viewModel.cols}
        placeholder={this.viewModel.placeholder}
        maxLength={this.viewModel.maxLength}
        defaultValue={this.initialValue}
        onChange={(event: any) => { this.viewModel.onTextAreaInput(event); }}
        onFocus={(event: any) => { this.viewModel.onTextAreaFocus(event); }}
        onBlur={(event: any) => { this.viewModel.onTextAreaBlur(event); }}
        onKeyDown={(event: any) => { this.viewModel.onTextAreaKeyDown(event); }}
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

ReactElementFactory.Instance.registerElement("sv-text-area", (props) => {
  return React.createElement(TextAreaComponent, props);
});