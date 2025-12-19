import * as React from "react";
import { Helpers, Question, DropdownListModel, settings, ItemValue } from "survey-core";
import { Popup } from "./components/popup/popup";
import { ReactElementFactory } from "./element-factory";
import { SurveyQuestionCommentValueItem } from "./reactquestion_comment";
import { SurveyQuestionUncontrolledElement } from "./reactquestion_element";
import { SurveyActionBar } from "./components/action-bar/action-bar";

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
  protected get dropdownListModel(): DropdownListModel {
    return this.question["dropdownListModel"];
  }
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
    if (this.question.readOnlyText) {
      return (<div className={this.question.cssClasses.controlValue}>
        {this.renderLocString(this.question.locReadOnlyText)}
      </div>);
    } else {
      return null;
    }
  }
  protected renderSelect(cssClasses: any): React.JSX.Element {
    let selectElement: React.JSX.Element | null = null;
    const dropdownListModel = this.dropdownListModel;
    if (this.question.isReadOnly) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      selectElement = <div id={this.question.inputId}
        role={dropdownListModel?.ariaQuestionRole}
        aria-label={dropdownListModel?.ariaQuestionLabel}
        aria-labelledby={dropdownListModel?.ariaQuestionLabelledby}
        aria-describedby={dropdownListModel?.ariaQuestionDescribedby}
        aria-expanded="false"
        aria-readonly="true"
        aria-disabled="true"
        tabIndex={this.question.isDisabledAttr ? undefined : 0}
        className={this.question.getControlClass()}
        ref={(div) => (this.setControl(div))}>
        {this.renderReadOnlyElement()}
        {this.renderEditorButtons()}
      </div>;
    } else {
      selectElement = <>
        {this.renderInput()}
        {this.question.isInputReadOnly ? null : <Popup model={dropdownListModel.popupModel}></Popup>}
      </>;
    }

    return (
      <div className={cssClasses.selectWrapper} onClick={this.click}>
        {selectElement}
      </div>
    );
  }

  renderValueElement(): React.JSX.Element | null {
    if (this.question.showInputFieldComponent) {
      return ReactElementFactory.Instance.createElement(this.question.inputFieldComponentName, { item: this.dropdownListModel.getSelectedAction(), question: this.question });
    } else if (this.question.showSelectedItemLocText) {
      return this.renderLocString(this.question.selectedItemLocText);
    }
    return null;
  }

  protected renderInput(): React.JSX.Element {
    const dropdownListModel = this.dropdownListModel;
    let valueElement: React.JSX.Element | null = this.renderValueElement();

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
      role={dropdownListModel.ariaQuestionRole}
      aria-required={dropdownListModel.ariaQuestionRequired}
      aria-invalid={dropdownListModel.ariaQuestionInvalid}
      aria-errormessage={dropdownListModel.ariaQuestionErrorMessage}
      aria-expanded={dropdownListModel.ariaQuestionExpanded}
      aria-label={dropdownListModel.ariaQuestionLabel}
      aria-labelledby={dropdownListModel.ariaQuestionLabelledby}
      aria-describedby={dropdownListModel.ariaQuestionDescribedby}
      aria-controls={dropdownListModel.ariaQuestionControls}
      aria-activedescendant={dropdownListModel.ariaQuestionActivedescendant}
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
        {dropdownListModel.needRenderInput ? this.renderFilterInput() : null}
      </div>
      {this.renderEditorButtons()}
    </div>);
  }

  protected renderFilterInput(): React.JSX.Element {
    const { root } = settings.environment;
    const dropdownListModel = this.dropdownListModel;
    const onInputChange = (e: any) => {
      const activeElement = e.target.getRootNode()?.activeElement;
      if (e.target === activeElement) {
        dropdownListModel.inputStringRendered = e.target.value;
      }
    };

    return <input type="text" autoComplete="off"
      id={this.question.getInputId()}
      ref={(element) => (this.inputElement = element)}
      className={this.question.cssClasses.filterStringInput}
      role={dropdownListModel.ariaInputRole}
      aria-required={dropdownListModel.ariaInputRequired}
      aria-invalid={dropdownListModel.ariaInputInvalid}
      aria-errormessage={dropdownListModel.ariaInputErrorMessage}
      aria-expanded={dropdownListModel.ariaInputExpanded}
      aria-label={dropdownListModel.ariaInputLabel}
      aria-labelledby={dropdownListModel.ariaInputLabelledby}
      aria-describedby={dropdownListModel.ariaInputDescribedby}
      aria-controls={dropdownListModel.ariaInputControls}
      aria-activedescendant={dropdownListModel.ariaInputActivedescendant}
      placeholder={dropdownListModel.placeholderRendered}
      readOnly={dropdownListModel.filterReadOnly ? true : undefined}
      tabIndex={dropdownListModel.noTabIndex ? undefined : -1}
      disabled={this.question.isDisabledAttr}
      inputMode={dropdownListModel.inputMode}
      onChange={(e) => { onInputChange(e); }}
      onBlur={this.blur}
      onFocus={this.focus}
    ></input>;
  }

  protected renderOther(item: ItemValue, cssClasses: any): React.JSX.Element {
    if (!item || !item.isCommentShowing) return null;
    return (
      <div key={item.uniqueId} className={this.question.getCommentAreaCss(true)}>
        <SurveyQuestionCommentValueItem
          question={this.question}
          item={item}
          cssClasses={this.question.cssClasses}
        />
      </div>
    );
  }

  protected renderEditorButtons(): React.JSX.Element | null {
    return <SurveyActionBar model={this.dropdownListModel.editorButtons}></SurveyActionBar>;
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