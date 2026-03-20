import * as React from "react";
import { RendererFactory, ItemValue } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionDropdown } from "./reactquestion_dropdown";
import { SurveyQuestionOptionItem } from "./dropdown-item";
import { SurveyActionBar } from "./components/action-bar/action-bar";

export class SurveyQuestionDropdownSelect extends SurveyQuestionDropdown {
  constructor(props: any) {
    super(props);
  }

  protected renderSelect(cssClasses: any): React.JSX.Element {
    const click = (event: any) => {
      this.question.onClick(event);
    };
    const keyup = (event: any) => {
      this.question.onKeyUp(event);
    };

    const selectElement = this.isDisplayMode ? (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <div id={this.question.inputId} className={this.question.getControlClass()} disabled>{this.question.readOnlyText}</div>) :
      (<select
        id={this.question.inputId}
        className={cssClasses.controlValue}
        ref={(select) => (this.setControl(select))}
        autoComplete={this.question.autocomplete}
        onChange={this.updateValueOnEvent}
        onInput={this.updateValueOnEvent}
        onClick={click}
        onKeyUp={keyup}
        aria-required={this.question.a11y_input_ariaRequired}
        aria-label={this.question.a11y_input_ariaLabel}
        aria-invalid={this.question.a11y_input_ariaInvalid}
        aria-errormessage={this.question.a11y_input_ariaErrormessage}
        required={this.question.isRequired}>
        {this.question.allowClear ? (<option value="">{this.question.placeholder}</option>) : null}
        {this.question.visibleChoices.map((item: ItemValue) => <SurveyQuestionOptionItem key={item.uniqueId} item={item} />)}
      </select>);
    return (
      <div className={cssClasses.selectWrapper}>
        <div className={this.question.getControlClass()}>
          {selectElement}
          {this.renderEditorButtons()}
        </div>
      </div>
    );
  }

  protected renderEditorButtons(): React.JSX.Element | null {
    return <SurveyActionBar model={this.question.inputActionBar}></SurveyActionBar>;
  }
}

ReactQuestionFactory.Instance.registerQuestion("sv-dropdown-select", (props) => {
  return React.createElement(SurveyQuestionDropdownSelect, props);
});

RendererFactory.Instance.registerRenderer("dropdown", "select", "sv-dropdown-select");