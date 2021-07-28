import { Component } from "vue-property-decorator";
import { QuestionVue } from "./question";
import { QuestionBooleanModel } from "survey-core";
import { CssClassBuilder } from "src/utils/cssClassBuilder";

@Component
export class Boolean extends QuestionVue<QuestionBooleanModel> {
  get itemClass() {
    const isChecked = this.question.checkedValue;
    const isDisabled = this.question.isReadOnly;
    const cssClasses = this.question.cssClasses;
    return new CssClassBuilder()
      .append(cssClasses.item)
      .append(cssClasses.itemDisabled, isDisabled)
      .append(cssClasses.itemChecked, isChecked)
      .append(cssClasses.itemIndeterminate, isChecked === null)
      .toString();
  }
  getLabelClass(checked: boolean): string {
    const question = this.question;
    return new CssClassBuilder()
      .append(question.cssClasses.label)
      .append(question.cssClasses.disabledLabel, question.checkedValue === !checked || question.isReadOnly)
      .toString();
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
  public onLabelClick(event: any, value: boolean) {
    if (this.question.isIndeterminate) {
      this.preventDefaults(event);
      this.question.checkedValue = value;
    }
  }
}
