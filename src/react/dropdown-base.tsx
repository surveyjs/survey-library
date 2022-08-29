import * as React from "react";
import { Question, DropdownListModel } from "survey-core";
import { Helpers } from "../helpers";
import { Popup } from "./components/popup/popup";
import { SvgIcon } from "./components/svg-icon/svg-icon";
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
   keyup = (event: any) => {
     this.question.dropdownListModel?.onKeyUp(event);
   };
   blur = (event: any) => {
     this.question.dropdownListModel?.onBlur(event);
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
       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
       // @ts-ignore
       selectElement = <div id={this.question.inputId} className={this.question.getControlClass()} disabled>{this.question.readOnlyText}</div>;
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

   protected renderInput(dropdownListModel: DropdownListModel): JSX.Element {
     const onInputChange = (e: any) => {
       if (e.target === document.activeElement) {
         dropdownListModel.filterString = e.target.value;
       }
     };
     const onInputKeyUp = (e: any) => {
       dropdownListModel.keyupHandler(e);
     };
     return (<div
       id={this.question.inputId}
       className={this.question.getControlClass()}
       tabIndex={this.question.isInputReadOnly || dropdownListModel.searchEnabled ? undefined : 0}
       onClick={this.click}
       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
       // @ts-ignore
       disabled={this.question.isInputReadOnly}
       required={this.question.isRequired}
       onChange={this.updateValueOnEvent}
       onInput={this.updateValueOnEvent}
       onKeyUp={this.keyup}
       onBlur={this.blur}
       role={this.question.ariaRole}
       aria-required={this.question.ariaRequired}
       aria-label={this.question.ariaLabel}
       aria-invalid={this.question.ariaInvalid}
       aria-describedby={this.question.ariaDescribedBy}
     >
       <div className={this.question.cssClasses.controlValue}>
         <input type="text"
           ref={(element) => (this.inputElement = element)}
           className={ this.question.cssClasses.filterStringInput }
           placeholder= { this.question.readOnlyText }
           readOnly= { !dropdownListModel.searchEnabled ? true : undefined }
           onKeyUp={(e) => { onInputKeyUp(e); }}
           onChange={(e) => { onInputChange(e); }}
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