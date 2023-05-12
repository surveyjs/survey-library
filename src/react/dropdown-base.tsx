import * as React from "react";
import { Helpers, Question, DropdownListModel, settings } from "survey-core";
import { Popup } from "./components/popup/popup";
import { SvgIcon } from "./components/svg-icon/svg-icon";
import { ReactElementFactory } from "./element-factory";
import { SurveyQuestionOtherValueItem } from "./reactquestion_comment";
import { SurveyQuestionUncontrolledElement } from "./reactquestion_element";

export class SurveyQuestionDropdownBase<T extends Question> extends SurveyQuestionUncontrolledElement<T> {
  inputElement: HTMLInputElement | null;

  click = (event: any) => {
    this.question.dropdownListModel?.onClick(event);
  };
  clear = (event: any) => {
    this.question.dropdownListModel?.onClear(event);
  };
  keyhandler = (event: any) => {
    this.question.dropdownListModel?.keyHandler(event);
  };
  blur = (event: any) => {
    this.question.dropdownListModel?.onBlur(event);
    this.updateInputDomElement();
  };
  focus = (event: any) => {
    this.question.dropdownListModel?.onFocus(event);
  };
  protected getStateElement() {
    return this.question["dropdownListModel"];
  }
  protected setValueCore(newValue: any) {
    this.questionBase.renderedValue = newValue;
  }
  protected getValueCore(): any {
    return this.questionBase.renderedValue;
  }
  protected renderSelect(cssClasses: any): JSX.Element {
    let selectElement: JSX.Element | null = null;
    if (this.question.isReadOnly) {
      const text = (this.question.selectedItemLocText) ? this.renderLocString(this.question.selectedItemLocText) : "";
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      selectElement = <div id={this.question.inputId} className={this.question.getControlClass()} disabled>
        {text}
        <div>{this.question.readOnlyText}</div>
      </div>;
    } else {
      if (!(this.question as any)["dropdownListModel"]) {
        (this.question as any)["dropdownListModel"] = new DropdownListModel(this.question);
      }
      selectElement = <>
        {this.renderInput(this.question["dropdownListModel"])}
        <Popup model={this.question?.dropdownListModel?.popupModel}></Popup>
      </>;
    }

    return (
      <div className={cssClasses.selectWrapper}>
        {selectElement}
      </div>
    );
  }

  renderValueElement(dropdownListModel: DropdownListModel): JSX.Element | null {
    if (this.question.showInputFieldComponent) {
      return ReactElementFactory.Instance.createElement(this.question.inputFieldComponentName, { item: dropdownListModel.getSelectedAction(), question: this.question });
    } else if (this.question.showSelectedItemLocText) {
      return this.renderLocString(this.question.selectedItemLocText);
    }
    return null;
  }

  protected renderInput(dropdownListModel: DropdownListModel): JSX.Element {
    let valueElement: JSX.Element | null = this.renderValueElement(dropdownListModel);
    const { root } = settings.environment;

    const onInputChange = (e: any) => {
      if (e.target === root.activeElement) {
        dropdownListModel.inputStringRendered = e.target.value;
      }
    };
    return (<div
      id={this.question.inputId}
      className={this.question.getControlClass()}
      tabIndex={dropdownListModel.inputReadOnly ? undefined : 0}
      onClick={this.click}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      disabled={this.question.isInputReadOnly}
      required={this.question.isRequired}
      onKeyDown={this.keyhandler}
      onBlur={this.blur}
      role={this.question.ariaRole}
      aria-required={this.question.ariaRequired}
      aria-label={this.question.ariaLabel}
      aria-invalid={this.question.ariaInvalid}
      aria-describedby={this.question.ariaDescribedBy}
      aria-expanded={this.question.ariaExpanded === "true"}
      aria-controls={dropdownListModel.listElementId}
      aria-activedescendant={dropdownListModel.ariaActivedescendant}
    >
      {dropdownListModel.showHintPrefix ?
        (<div className={this.question.cssClasses.hintPrefix}>
          <span>{dropdownListModel.hintStringPrefix}</span>
        </div>) : null}
      <div className={this.question.cssClasses.controlValue}>
        {dropdownListModel.showHintString ?
          (<div className={this.question.cssClasses.hintSuffix}>
            <span style={{ visibility: "hidden" }} data-bind="text: model.filterString">{dropdownListModel.inputStringRendered}</span>
            <span>{dropdownListModel.hintStringSuffix}</span>
          </div>) : null}
        {valueElement}
        <input type="text" autoComplete="off"
          id={this.question.getInputId()}
          ref={(element) => (this.inputElement = element)}
          className={this.question.cssClasses.filterStringInput}
          role={dropdownListModel.filterStringEnabled ? this.question.ariaRole : undefined}
          aria-label={this.question.placeholder}
          aria-expanded={this.question.ariaExpanded === "true"}
          aria-controls={dropdownListModel.listElementId}
          aria-activedescendant={dropdownListModel.ariaActivedescendant}
          placeholder={dropdownListModel.placeholderRendered}
          readOnly={!dropdownListModel.searchEnabled ? true : undefined}
          tabIndex={dropdownListModel.inputReadOnly ? undefined : -1}
          disabled={this.question.isInputReadOnly}
          inputMode={dropdownListModel.inputMode}
          onChange={(e) => { onInputChange(e); }}
          onBlur={this.blur}
          onFocus={this.focus}
        ></input>
      </div>
      {this.createClearButton()}
    </div>);
  }

  createClearButton(): JSX.Element | null {
    if (!this.question.allowClear || !this.question.cssClasses.cleanButtonIconId) return null;

    const style = { display: this.question.isEmpty() ? "none" : "" };
    return (
      <div
        className={this.question.cssClasses.cleanButton}
        style={style}
        onClick={this.clear}
      >
        <SvgIcon
          className={this.question.cssClasses.cleanButtonSvg}
          iconName={this.question.cssClasses.cleanButtonIconId}
          title={this.question.clearCaption}
          size={"auto"}
        ></SvgIcon>
      </div>
    );
  }

  protected renderOther(cssClasses: any): JSX.Element {
    return (
      <div className={this.question.getCommentAreaCss(true)}>
        <SurveyQuestionOtherValueItem
          question={this.question}
          otherCss={cssClasses.other}
          cssClasses={cssClasses}
          isDisplayMode={this.isDisplayMode}
          isOther={true}
        />
      </div>
    );
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    this.updateInputDomElement();
  }
  componentDidMount() {
    super.componentDidMount();
    this.updateInputDomElement();
  }
  updateInputDomElement() {
    if (!!this.inputElement) {
      const control: any = this.inputElement;
      const newValue = this.question.dropdownListModel.inputStringRendered;
      if (!Helpers.isTwoValueEquals(newValue, control.value)) {
        control.value = this.question.dropdownListModel.inputStringRendered;
      }
    }
  }
}