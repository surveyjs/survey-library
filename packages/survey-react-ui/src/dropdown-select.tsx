import * as React from "react";
import { RendererFactory, ItemValue } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionDropdown } from "./reactquestion_dropdown";
import { SurveyQuestionOptionItem } from "./dropdown-item";
import { SvgIcon } from "./components/svg-icon/svg-icon";

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
        className={this.question.getControlClass()}
        ref={(select) => (this.setControl(select))}
        autoComplete={this.question.autocomplete}
        onChange={this.updateValueOnEvent}
        onInput={this.updateValueOnEvent}
        onClick={click}
        onKeyUp={keyup}
        aria-required={this.question.ariaRequired}
        aria-label={this.question.ariaLabel}
        aria-invalid={this.question.ariaInvalid}
        aria-errormessage={this.question.ariaErrormessage}
        required={this.question.isRequired}>
        {this.question.allowClear ? (<option value="">{this.question.placeholder}</option>) : null}
        {this.question.visibleChoices.map((item: ItemValue, i: number) => <SurveyQuestionOptionItem key={"item" + i} item={item} />)}
      </select>);
    return (
      <div className={cssClasses.selectWrapper}>
        {selectElement}
        {this.createChevronButton()}
      </div>
    );
  }

  createChevronButton(): React.JSX.Element | null {
    if (!this.question.cssClasses.chevronButtonIconId) return null;

    return (
      <div className={this.question.cssClasses.chevronButton}
        aria-hidden="true"
        onPointerDown={this.chevronPointerDown}>
        <SvgIcon
          className={this.question.cssClasses.chevronButtonSvg}
          iconName={this.question.cssClasses.chevronButtonIconId}
          size={"auto"}
        ></SvgIcon>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("sv-dropdown-select", (props) => {
  return React.createElement(SurveyQuestionDropdownSelect, props);
});

RendererFactory.Instance.registerRenderer("dropdown", "select", "sv-dropdown-select");