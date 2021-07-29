import { Component } from "vue-property-decorator";
import { QuestionBooleanModel, CssClassBuilder } from "survey-core";
import { QuestionVue } from "./question";

@Component
export class Boolean extends QuestionVue<QuestionBooleanModel> {
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
