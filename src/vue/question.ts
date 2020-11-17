import Vue from "vue";
import { Base } from "../base";
import { Question } from "../question";
import { Component, Prop, Watch } from "vue-property-decorator";
import {BaseVue} from "./base";

@Component
export class QuestionVue<T extends Question> extends BaseVue {
  public innerValue: any = null;

  @Prop question: T;
  // css prop need only for panel. When panel will have cssClasses property this prop will need to remove
  @Prop css: any;

  @Watch("question")
  changeQuestion(new_val: T, old_val: T) {
    this.innerValue = null;
  }
  protected getModel(): Base { return this.question; }
  protected onMounted() {
    if (this.question) {
      this.question.afterRenderQuestionElement(this.$el);
    }
  }
  beforeDestroy() {
    if (this.question) {
      this.question.beforeDestroyQuestionElement(this.$el);
    }
  }

}

export default QuestionVue;
