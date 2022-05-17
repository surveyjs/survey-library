import * as React from "react";
import { RendererFactory } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionDropdown } from "./reactquestion_dropdown";
import { Popup } from "./components/popup/popup";
import { PopupUtils } from "../utils/popup";
import { attachKey2click } from "./reactSurvey";

export class SurveyQuestionDropdownSelect extends SurveyQuestionDropdown {
  constructor(props: any) {
    super(props);
  }

  protected renderSelect(cssClasses: any): JSX.Element {
    const click = (_: any, e: any) => {
      PopupUtils.updatePopupWidthBeforeShow(this.question.popupModel, e);
    };

    let selectElement = null;
    if(this.question.isReadOnly) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      selectElement = <div id={this.question.inputId} className={this.question.getControlClass()} disabled>{ this.question.readOnlyText }</div>;
    } else {
      const inputElement = attachKey2click(
        <div
          id={this.question.inputId}
          className={this.question.getControlClass()}
          tabIndex={0}
          onClick={(event) => click(null, event)}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          disabled={this.question.isInputReadOnly}
          required={this.question.isRequired}
          onChange={this.updateValueOnEvent}
          onInput={this.updateValueOnEvent}
          aria-required={this.question.ariaRequired}
          aria-label={this.question.ariaLabel}
          aria-invalid={this.question.ariaInvalid}
          aria-describedby={this.question.ariaDescribedBy}
        >{ this.question.readOnlyText }
        </div>, null, { processEsc: false });

      selectElement = <>
        {inputElement}
        <Popup model={this.question.popupModel}></Popup>
      </>;
    }

    return (
      <div className={cssClasses.selectWrapper}>
        {selectElement}
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion(
  "sv-dropdown-select",
  (props) => {
    return React.createElement(SurveyQuestionDropdownSelect, props);
  }
);

RendererFactory.Instance.registerRenderer("dropdown", "select", "sv-dropdown-select");