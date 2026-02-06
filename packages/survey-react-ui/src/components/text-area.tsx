import * as React from "react";
import { ResizeManager, TextAreaModel } from "survey-core";
import { ReactElementFactory } from "../element-factory";
import { SurveyElementBase } from "../reactquestion_element";
import { CharacterCounterComponent } from "./character-counter";
import { SvgIcon } from "./svg-icon/svg-icon";

interface ITextAreaProps {
  viewModel: TextAreaModel;
}

export class TextAreaComponent extends SurveyElementBase<ITextAreaProps, any> {
  private textareaRef: React.RefObject<HTMLTextAreaElement> = React.createRef();
  private anchorRef: React.RefObject<HTMLDivElement> = React.createRef();
  private resizeManager: ResizeManager;
  private initialValue;

  constructor(props: ITextAreaProps) {
    super(props);
    this.initialValue = this.viewModel.getTextValue() || "";
  }
  get viewModel(): TextAreaModel {
    return this.props.viewModel;
  }
  protected canRender(): boolean {
    return !!this.viewModel.question;
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.anchorRef.current && this.textareaRef.current && this.viewModel.question.resizeStyle !== "none") {
      this.resizeManager = new ResizeManager(this.anchorRef.current, this.textareaRef.current, this.viewModel.question.resizeStyle);
    }
    let el = this.textareaRef.current;
    if (!!el) {
      this.viewModel.setElement(el);
    }
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    this.resizeManager?.dispose();
    this.viewModel.resetElement();
  }
  private onContainerClick(event: any) {
    if (event.target == event.currentTarget) {
      this.textareaRef.current?.focus();
    }
  }

  protected renderElement(): React.JSX.Element {
    const cssClasses = this.viewModel.getCssClasses();
    return (
      <div className={cssClasses.root} onClick={(event) =>this.onContainerClick(event)}>
        <textarea
          id={this.viewModel.id}
          className={cssClasses.control}
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
          style={{ resize: "none" }}
        />
        {this.viewModel.characterCounter ?
          <div className={cssClasses.group}>
            <CharacterCounterComponent
              counter={this.viewModel.characterCounter}
              remainingCharacterCounter={cssClasses.characterCounter}>
            </CharacterCounterComponent>
          </div> : null
        }
        {this.viewModel.question.resizeStyle !== "none" ? <div className={cssClasses.grip} ref={this.anchorRef}>
          <SvgIcon iconName={cssClasses.gripIconId} size={"auto"}></SvgIcon>
        </div> : null}
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-text-area", (props) => {
  return React.createElement(TextAreaComponent, props);
});