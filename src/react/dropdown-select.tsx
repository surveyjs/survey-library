import * as React from "react";
import { RendererFactory } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionDropdown } from "./reactquestion_dropdown";
import { SurveyQuestionOptionItem } from "./dropdown-item";
import { ItemValue } from "../itemvalue";

export class SurveyQuestionDropdownSelect extends SurveyQuestionDropdown {
  constructor(props: any) {
    super(props);
  }

  protected renderSelect(cssClasses: any): JSX.Element {
    const selectElement = this.isDisplayMode ? (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <div id={this.question.inputId} className={this.question.getControlClass()} disabled>{ this.question.readOnlyText }</div>):
      (<select
        id={this.question.inputId}
        className={this.question.getControlClass()}
        ref={(select) => (this.control = select)}
        autoComplete={this.question.autoComplete}
        onChange={this.updateValueOnEvent}
        onInput={this.updateValueOnEvent}
        onClick={this.onClick}
        aria-required={this.question.ariaRequired}
        aria-label={this.question.ariaLabel}
        aria-invalid={this.question.ariaInvalid}
        aria-describedby={this.question.ariaDescribedBy}
        required={this.question.isRequired}>
        { this.question.showOptionsCaption ? (<option value="">{this.question.optionsCaption}</option>) : null }
        { this.question.visibleChoices.map((item: ItemValue, i: number) => <SurveyQuestionOptionItem key={"item" + i} item={item}/>) }
      </select>);
    return (
      <div className={cssClasses.selectWrapper}>
        {selectElement}
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("sv-dropdown-select", (props) => {
  return React.createElement(SurveyQuestionDropdownSelect, props);
});

RendererFactory.Instance.registerRenderer("dropdown", "select", "sv-dropdown-select");