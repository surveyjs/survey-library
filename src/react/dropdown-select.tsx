import * as React from "react";
import { RendererFactory } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionDropdown } from "./reactquestion_dropdown";
import { Popup } from "./components/popup/popup";
import { PopupUtils } from "../utils/popup";
import { attachKey2click } from "./reactSurvey";
import { SvgIcon } from "./components/svg-icon/svg-icon";
import { findParentByClass } from "../utils/utils";

export class SurveyQuestionDropdownSelect extends SurveyQuestionDropdown {
  constructor(props: any) {
    super(props);
  }

  protected renderSelect(cssClasses: any): JSX.Element {
    const click = (_: any, e: any) => {
      if (!!e && !!e.target) {
        const target = findParentByClass(e.target, this.question.cssClasses.control);
        if(!!target) {
          PopupUtils.updatePopupWidthBeforeShow(this.question.popupModel, target, e);
        }
      }
    };

    let selectElement = null;
    if(this.question.isReadOnly) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      selectElement = <div id={this.question.inputId} className={this.question.getControlClass()} disabled>
        <div>{ this.question.readOnlyText }</div>
      </div>;
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
        >
          <div className={this.question.cssClasses.controlValue}>{ this.question.readOnlyText }</div>
          {this.createClearButton()}
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

  createClearButton(): JSX.Element {
    if(!this.question.showClearButton || !this.question.cssClasses.cleanButtonIconId) return null;

    const style = { display: this.question.isEmpty() ? "none": "" };
    return (
      <div
        className={this.question.cssClasses.cleanButton}
        style={style}
        onClick={(e: any) => { this.question.onClear(e); }}
      >
        <SvgIcon
          className={this.question.cssClasses.cleanButtonSvg}
          iconName={this.question.cssClasses.cleanButtonIconId}
          size={"auto"}
        ></SvgIcon>
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