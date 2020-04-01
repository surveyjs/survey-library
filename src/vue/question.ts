import Vue from "vue";
import { Question } from "../question";
import { Component, Prop, Watch } from "vue-property-decorator";

@Component
export class QuestionVue<T extends Question> extends Vue {
  public innerValue: any = null;

  @Prop question: T;
  // css prop need only for panel. When panel will have cssClasses property this prop will need to remove
  @Prop css: any;

  @Watch("question")
  changeQuestion(new_val: T, old_val: T) {
    this.innerValue = null;
  }
  mounted() {
    if (this.question) {
      this.question.afterRenderQuestionElement(this.$el);
    }
  }
  beforeDestroy() {
    if (this.question) {
      this.question.beforeDestoyQuestionElement(this.$el);
    }
  }

}

export default QuestionVue;
