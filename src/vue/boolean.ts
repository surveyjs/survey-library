import { Component } from "vue-property-decorator";
import { QuestionBooleanModel, CssClassBuilder } from "survey-core";
import { QuestionVue } from "./question";

@Component
export class Boolean extends QuestionVue<QuestionBooleanModel> {
  public onSwitchClick(event: any) {
    this.question.onSwitchClickModel(event);
  }
  public onLabelClick(event: any, value: boolean) {
    this.question.onLabelClick(event, value);
  }
}
