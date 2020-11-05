import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionBooleanModel } from '../question_boolean';

@Component
export class Boolean extends QuestionVue<QuestionBooleanModel> {
  get itemClass() {
    var question = this.question;
    var cssClasses = question.cssClasses;
    let isChecked = question.checkedValue;
    let isDisabled = question.isReadOnly;
    let itemClass = cssClasses.item;
    if (isDisabled) itemClass += " " + cssClasses.itemDisabled;
    if (isChecked) itemClass += " " + cssClasses.itemChecked;
    else if (isChecked === null)
      itemClass += " " + cssClasses.itemIndeterminate;
    return itemClass;
  }
  getLabelClass(checked: boolean): string {
    var question = this.question;
    var cssClasses = this.question.cssClasses;
    return (
      cssClasses.label +
      " " +
      (question.checkedValue === !checked || question.isReadOnly
        ? question.cssClasses.disabledLabel
        : "")
    );
  }
  private preventDefaults(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
  public onSwitchClick(event: any) {
    if (this.question.isIndeterminate) {
      this.preventDefaults(event);
      var isRightClick = event.offsetX / event.target.offsetWidth > 0.5;
      var isRtl =
        document.defaultView.getComputedStyle(event.target).direction == "rtl";
      this.question.checkedValue = isRtl ? !isRightClick : isRightClick;
     }
  }
  public onLabelClick(event: any, value: boolean){
    if(this.question.isIndeterminate){
      this.preventDefaults(event)
      this.question.checkedValue = value; 
    }
  }
}
