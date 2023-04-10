import { Base } from "survey-core";
import { Question } from "survey-core";
import { Component, Prop, Watch } from "vue-property-decorator";
import { BaseVue } from "./base";

@Component
export class QuestionVue<T extends Question> extends BaseVue {
  public innerValue: any = null;

  @Prop() question: T;
  // css prop need only for panel. When panel will have cssClasses property this prop will need to remove
  @Prop() css: any;

  @Watch("question")
  changeQuestion(new_val: T, old_val: T) {
    this.innerValue = null;
  }
  protected getModel(): Base {
    return this.question;
  }
  protected onMounted() {
    if (this.question) {
      this.question.afterRenderQuestionElement(this.$el as HTMLElement);
    }
  }
  beforeDestroy() {
    if (this.question) {
      this.question.beforeDestroyQuestionElement(this.$el as HTMLElement);
    }
  }
}

export function getComponentName(question: Question): string {
  if (question.customWidget) return "survey-customwidget";
  if(question.isDefaultRendering && question.isDefaultRendering() || question.isPanel) return "survey-" + question.getTemplate();
  return question.getComponentName();
}

export default QuestionVue;
