import Vue from "vue";
import { Question as QuestionModel } from "../question";
import { Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class Question<T extends QuestionModel> extends Vue {
  public innerValue = null;

  @Prop question: T;
  // css prop need only for panel. When panel will have cssClasses property this prop will need to remove
  @Prop css: any;

  @Watch("question")
  changeQuestion(new_val: T, old_val: T) {
    this.innerValue = null;
  }
}
