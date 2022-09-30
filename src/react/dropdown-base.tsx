import * as React from "react";
import { Question, DropdownListModel } from "survey-core";
import { Helpers } from "../helpers";
import { Popup } from "./components/popup/popup";
import { SvgIcon } from "./components/svg-icon/svg-icon";
import { ReactElementFactory } from "./element-factory";
import { SurveyQuestionCommentItem } from "./reactquestion_comment";
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
       if (!(this.question as any).hasOwnProperty("dropdownListModel")) {
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
     if(this.question.showInputFieldComponent) {
       return ReactElementFactory.Instance.createElement(this.question.inputFieldComponentName, { item: dropdownListModel.getSelectedAction(), question: this.question });
     } else if(this.question.showSelectedItemLocText) {
       return this.renderLocString(this.question.selectedItemLocText);
     }
     return null;
   }

   protected renderInput(dropdownListModel: DropdownListModel): JSX.Element {
     let valueElement: JSX.Element | null = this.renderValueElement(dropdownListModel);

     const onInputChange = (e: any) => {
       if (e.target === document.activeElement) {
         dropdownListModel.filterString = e.target.value;
       }
     };
     return (<div
       id={this.question.inputId}
       className={this.question.getControlClass()}
       tabIndex={ dropdownListModel.inputReadOnly ? undefined : 0}
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
     >
       <div className={this.question.cssClasses.controlValue}>
         {valueElement}
         <input type="text" autoComplete="off"
           id={ this.question.getInputId() }
           ref={(element) => (this.inputElement = element)}
           className={ this.question.cssClasses.filterStringInput }
           placeholder= { this.question.readOnlyText }
           readOnly= { !dropdownListModel.searchEnabled ? true : undefined }
           tabIndex={ dropdownListModel.inputReadOnly ? undefined : -1 }
           disabled={this.question.isInputReadOnly}
           onChange={(e) => { onInputChange(e); }}
           onBlur={this.blur}
         ></input>
       </div>
       {this.createClearButton()}
     </div>);
   }

   createClearButton(): JSX.Element {
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
           title={this.question.cleanButtonCaption}
           size={"auto"}
         ></SvgIcon>
       </div>
     );
   }

   protected renderOther(cssClasses: any): JSX.Element {
     return (
       <div className="form-group">
         <SurveyQuestionCommentItem
           question={this.question}
           otherCss={cssClasses.other}
           cssClasses={cssClasses}
           isDisplayMode={this.isDisplayMode}
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
       const newValue = this.question.dropdownListModel.filterString;
       if (!Helpers.isTwoValueEquals(newValue, control.value)) {
         control.value = this.question.dropdownListModel.filterString;
       }
     }
   }
}