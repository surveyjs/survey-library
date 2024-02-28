import * as React from "react";
import { SurveyQuestionUncontrolledElement } from "./reactquestion_element";
import { QuestionTextModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { CharacterCounterComponent } from "./components/character-counter";

export class SurveyQuestionText extends SurveyQuestionUncontrolledElement<
  QuestionTextModel
> {
  //controlRef: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);
    //this.controlRef = React.createRef();
  }
  protected renderInput() {
    const inputClass = (this.question as QuestionTextModel).getControlClass();

    const placeholder = this.question.renderedPlaceholder;
    if (this.question.isReadOnlyRenderDiv()) {
      return <div>{this.question.inputValue}</div>;
    }
    const counter = !!this.question.getMaxLength() ? (<CharacterCounterComponent counter={this.question.characterCounter} remainingCharacterCounter={this.question.cssClasses.remainingCharacterCounter}></CharacterCounterComponent>) : null;
    return (
      <>
        <input
          id={this.question.inputId}
          disabled={this.isDisplayMode}
          className={inputClass}
          type={this.question.inputType}
          //ref={this.controlRef}
          ref={(input) => (this.setControl(input))}
          style={this.question.inputStyle}
          maxLength={this.question.getMaxLength()}
          min={this.question.renderedMin}
          max={this.question.renderedMax}
          step={this.question.renderedStep}
          size={this.question.inputSize}
          placeholder={placeholder}
          list={this.question.dataListId}
          autoComplete={this.question.autocomplete}
          onBlur={this.question.onBlur}
          onFocus={this.question.onFocus}
          onChange={this.question.onChange}
          onKeyUp={this.question.onKeyUp}
          onKeyDown={this.question.onKeyDown}
          onCompositionUpdate={(event) => this.question.onCompositionUpdate(event.nativeEvent)}
          aria-required={this.question.a11y_input_ariaRequired}
          aria-label={this.question.a11y_input_ariaLabel}
          aria-labelledby={this.question.a11y_input_ariaLabelledBy}
          aria-describedby={this.question.a11y_input_ariaDescribedBy}
          aria-invalid={this.question.a11y_input_ariaInvalid}
          aria-errormessage={this.question.a11y_input_ariaErrormessage}
        />
        {counter}
      </>
    );
  }
  protected renderElement(): JSX.Element {
    return (
      this.question.dataListId ?
        <div>
          { this.renderInput() }
          { this.renderDataList() }
        </div>:
        this.renderInput()
    );
  }
  protected setValueCore(newValue: any) {
    this.question.inputValue = newValue;
  }
  protected getValueCore(): any {
    return this.question.inputValue;
  }
  private renderDataList(): JSX.Element | null {
    if (!this.question.dataListId) return null;
    var items = this.question.dataList;
    if (items.length == 0) return null;
    var options:Array<JSX.Element> = [];
    for (var i = 0; i < items.length; i++) {
      options.push(<option key={"item"+i} value={items[i]}></option>);
    }
    return <datalist id={this.question.dataListId}>{options}</datalist>;
  }
  // protected updateDomElement() {
  //   this.control = this.controlRef.current;
  //   super.updateDomElement();
  // }
}

ReactQuestionFactory.Instance.registerQuestion("text", (props) => {
  return React.createElement(SurveyQuestionText, props);
});
