import * as React from "react";
import { Helpers, Question, DropdownListModel, settings, QuestionDropdownModel } from "survey-core";
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
  chevronPointerDown = (event: any) => {
    this.question.dropdownListModel?.chevronPointerDown(event);
  };
  clear = (event: any) => {
    this.question.dropdownListModel?.onClear(event);
  };
  keyhandler = (event: any) => {
    this.question.dropdownListModel?.keyHandler(event);
  };
  blur = (event: any) => {
    this.updateInputDomElement();
    this.question.onBlur(event);
  };
  focus = (event: any) => {
    this.question.onFocus(event);
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
  protected renderReadOnlyElement(): React.JSX.Element | null {
    if (this.question.locReadOnlyText) {
      return this.renderLocString(this.question.locReadOnlyText);
    } else {
      return null;
    }
  }
  protected renderSelect(cssClasses: any): React.JSX.Element {
    let selectElement: React.JSX.Element | null = null;
    if (this.question.isReadOnly) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      selectElement = <div id={this.question.inputId}
        aria-label={this.question.a11y_input_ariaLabel}
        aria-labelledby={this.question.a11y_input_ariaLabelledBy}
        aria-describedby={this.question.a11y_input_ariaDescribedBy}
        tabIndex={this.question.isDisabledAttr ? undefined : 0}
        className={this.question.getControlClass()}
        ref={(div) => (this.setControl(div))}>
        {this.renderReadOnlyElement()}
      </div>;
    } else {
      selectElement = <>
        {this.renderInput(this.question["dropdownListModel"])}
        <Popup model={this.question?.dropdownListModel?.popupModel}></Popup>
      </>;
    }

    return (
      <div className={cssClasses.selectWrapper} onClick={this.click}>
        {selectElement}
        {this.createChevronButton()}
      </div>
    );
  }

  renderValueElement(dropdownListModel: DropdownListModel): React.JSX.Element | null {
    if (this.question.showInputFieldComponent) {
      return ReactElementFactory.Instance.createElement(this.question.inputFieldComponentName, { item: dropdownListModel.getSelectedAction(), question: this.question });
    } else if (this.question.showSelectedItemLocText) {
      return this.renderLocString(this.question.selectedItemLocText);
    }
    return null;
  }

  protected renderInput(dropdownListModel: DropdownListModel): React.JSX.Element {
    let valueElement: React.JSX.Element | null = this.renderValueElement(dropdownListModel);
    const { root } = settings.environment;

    const onInputChange = (e: any) => {
      if (e.target === root.activeElement) {
        dropdownListModel.inputStringRendered = e.target.value;
      }
    };
    return (<div
      id={this.question.inputId}
      className={this.question.getControlClass()}
      tabIndex={dropdownListModel.noTabIndex ? undefined : 0}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      disabled={this.question.isDisabledAttr}
      required={this.question.isRequired}
      onKeyDown={this.keyhandler}
      onBlur={this.blur}
      onFocus={this.focus}
      role={this.question.ariaRole}
      aria-required={this.question.ariaRequired}
      aria-label={this.question.ariaLabel}
      aria-labelledby={this.question.ariaLabelledBy}
      aria-invalid={this.question.ariaInvalid}
      aria-errormessage={this.question.ariaErrormessage}
      aria-expanded={this.question.ariaExpanded}
      aria-controls={dropdownListModel.listElementId}
      aria-activedescendant={dropdownListModel.ariaActivedescendant}
      ref={(div) => (this.setControl(div))}
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
          aria-expanded={this.question.ariaExpanded}
          aria-label={this.question.a11y_input_ariaLabel}
          aria-labelledby={this.question.a11y_input_ariaLabelledBy}
          aria-describedby={this.question.a11y_input_ariaDescribedBy}
          aria-controls={dropdownListModel.listElementId}
          aria-activedescendant={dropdownListModel.ariaActivedescendant}
          placeholder={dropdownListModel.placeholderRendered}
          readOnly={dropdownListModel.filterReadOnly ? true : undefined}
          tabIndex={dropdownListModel.noTabIndex ? undefined : -1}
          disabled={this.question.isDisabledAttr}
          inputMode={dropdownListModel.inputMode}
          onChange={(e) => { onInputChange(e); }}
          onBlur={this.blur}
          onFocus={this.focus}
        ></input>
      </div>
      {this.createClearButton()}
    </div>);
  }

  createClearButton(): React.JSX.Element | null {
    if (!this.question.allowClear || !this.question.cssClasses.cleanButtonIconId) return null;

    const style = { display: !this.question.showClearButton ? "none" : "" };
    return (
      <div
        className={this.question.cssClasses.cleanButton}
        style={style}
        onClick={this.clear}
        aria-hidden="true"
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

  protected renderOther(cssClasses: any): React.JSX.Element {
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
  componentWillUnmount(): void {
    super.componentWillUnmount();
    if (this.question.dropdownListModel)this.question.dropdownListModel.focused = false;
  }
  updateInputDomElement() {
    if (!!this.inputElement) {
      const control: any = this.inputElement;
      const newValue = this.question.dropdownListModel.inputStringRendered;
      if (!Helpers.isTwoValueEquals(newValue, control.value, false, true, false)) {
        control.value = this.question.dropdownListModel.inputStringRendered;
      }
    }
  }
}