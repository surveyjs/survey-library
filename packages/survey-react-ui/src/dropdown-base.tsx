import * as React from "react";
import { Base, Helpers, Question, DropdownListModel, DropdownRenderState, settings, ItemValue } from "survey-core";
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
  // Everything the closed control renders. It does not create DropdownListModel; a question without it (a custom type)
  // falls back to the model.
  protected get renderState(): DropdownRenderState {
    return this.question["dropdownRenderState"] || this.question["dropdownListModel"];
  }
  // The model is created on the first interaction or when the popup is rendered; componentDidUpdate subscribes to it then.
  protected getStateElements(): Array<Base> {
    const res: Array<Base> = [this.question];
    const model = this.question["dropdownListModelValue"];
    if (!!model) res.push(model);
    return res;
  }
  protected setValueCore(newValue: any) {
    this.questionBase.renderedValue = newValue;
  }
  protected getValueCore(): any {
    return this.questionBase.renderedValue;
  }
  protected renderReadOnlyElement(): React.JSX.Element | null {
    if (this.question.showInputFieldComponent) {
      return (<div className={this.question.cssClasses.controlValue}>
        {this.renderValueElement()}
      </div>);
    }
    if (this.question.readOnlyText) {
      return (<div className={this.question.cssClasses.controlValue}>
        {this.renderLocString(this.question.locReadOnlyText)}
      </div>);
    }
    return null;
  }
  protected renderSelect(cssClasses: any): React.JSX.Element {
    let selectElement: React.JSX.Element | null = null;
    const renderState = this.renderState;
    if (this.question.isReadOnly) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      selectElement = <div id={this.question.inputId}
        role={renderState?.ariaQuestionRole}
        aria-label={renderState?.ariaQuestionLabel}
        aria-labelledby={renderState?.ariaQuestionLabelledby}
        aria-describedby={renderState?.ariaQuestionDescribedby}
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
        {this.question.isInputReadOnly ? null : <Popup model={this.dropdownListModel.popupModel}></Popup>}
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
      const actionItem = this.renderState.getSelectedAction();
      return ReactElementFactory.Instance.createElement(this.question.inputFieldComponentName, { item: actionItem, question: this.question });
    } else if (this.question.showSelectedItemLocText) {
      return this.renderLocString(this.question.selectedItemLocText);
    }
    return null;
  }

  protected renderInput(): React.JSX.Element {
    const renderState = this.renderState;
    let valueElement: React.JSX.Element | null = this.renderValueElement();

    return (<div
      id={this.question.inputId}
      className={this.question.getControlClass()}
      tabIndex={renderState.noTabIndex ? undefined : 0}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      disabled={this.question.isDisabledAttr}
      required={this.question.isRequired}
      onKeyDown={this.keyhandler}
      onBlur={this.blur}
      onFocus={this.focus}
      role={renderState.ariaQuestionRole}
      aria-required={renderState.ariaQuestionRequired}
      aria-invalid={renderState.ariaQuestionInvalid}
      aria-errormessage={renderState.ariaQuestionErrorMessage}
      aria-expanded={renderState.ariaQuestionExpanded}
      aria-label={renderState.ariaQuestionLabel}
      aria-labelledby={renderState.ariaQuestionLabelledby}
      aria-describedby={renderState.ariaQuestionDescribedby}
      aria-controls={renderState.ariaQuestionControls}
      aria-activedescendant={renderState.ariaQuestionActivedescendant}
      ref={(div) => (this.setControl(div))}
    >
      <div className={this.question.cssClasses.controlValue}>
        {renderState.showHintPrefix ?
          (<div className={this.question.cssClasses.hintPrefix}>
            <span>{renderState.hintStringPrefix}</span>
          </div>) : null}
        <div className={this.question.cssClasses.inputPrefixWrapper}>
          {renderState.showHintString ?
            (<div className={this.question.cssClasses.hintSuffix}>
              <span style={{ visibility: "hidden" }} data-bind="text: model.filterString">{renderState.inputStringRendered}</span>
              <span>{renderState.hintStringSuffix}</span>
            </div>) : null}
          {valueElement}
          {renderState.needRenderInput ? this.renderFilterInput() : null}
        </div>
      </div>
      {this.renderEditorButtons()}
    </div>);
  }

  protected renderFilterInput(): React.JSX.Element {
    const { root } = settings.environment;
    const renderState = this.renderState;
    const onInputChange = (e: any) => {
      const activeElement = e.target.getRootNode()?.activeElement;
      if (e.target === activeElement) {
        this.dropdownListModel.inputStringRendered = e.target.value;
      }
    };

    return <input type="text" autoComplete="off"
      id={this.question.getInputId()}
      ref={(element) => (this.inputElement = element)}
      className={this.question.cssClasses.filterStringInput}
      role={renderState.ariaInputRole}
      aria-required={renderState.ariaInputRequired}
      aria-invalid={renderState.ariaInputInvalid}
      aria-errormessage={renderState.ariaInputErrorMessage}
      aria-expanded={renderState.ariaInputExpanded}
      aria-label={renderState.ariaInputLabel}
      aria-labelledby={renderState.ariaInputLabelledby}
      aria-describedby={renderState.ariaInputDescribedby}
      aria-controls={renderState.ariaInputControls}
      aria-activedescendant={renderState.ariaInputActivedescendant}
      placeholder={renderState.placeholderRendered}
      readOnly={renderState.filterReadOnly ? true : undefined}
      tabIndex={renderState.noTabIndex ? undefined : -1}
      disabled={this.question.isDisabledAttr}
      inputMode={renderState.inputMode}
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
    return <SurveyActionBar model={this.renderState.editorButtons}></SurveyActionBar>;
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
    const model = this.question["dropdownListModelValue"];
    if (model) model.focused = false;
  }
  updateInputDomElement() {
    if (!!this.inputElement) {
      const control: any = this.inputElement;
      const newValue = this.renderState.inputStringRendered;
      if (!Helpers.isTwoValueEquals(newValue, control.value, false, true, false)) {
        control.value = this.renderState.inputStringRendered;
      }
    }
  }
}