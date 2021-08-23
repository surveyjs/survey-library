import { Component } from "vue-property-decorator";
import { QuestionBooleanModel, CssClassBuilder } from "survey-core";
import { QuestionVue } from "./question";

@Component
export class Boolean extends QuestionVue<QuestionBooleanModel> {
  private preventDefaults(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
  public onSwitchClick(event: any) {
    if (this.question.isIndeterminate) {
      this.preventDefaults(event);
      const isRightClick = event.offsetX / event.target.offsetWidth > 0.5;
      const isRtl =
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
