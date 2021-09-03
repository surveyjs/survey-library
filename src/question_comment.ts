import { Question } from "./question";
import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";
import { QuestionTextBase } from "./question_textbase";
import { increaseHeightByContent } from "./utils/utils";

/**
 * A Model for a comment question
 */
export class QuestionCommentModel extends QuestionTextBase {
  private element: HTMLElement;
  /**
   * The html rows attribute.
   */
  public get rows(): number {
    return this.getPropertyValue("rows");
  }
  public set rows(val: number) {
    this.setPropertyValue("rows", val);
  }
  /**
   * The html cols attribute.
   */
  public get cols(): number {
    return this.getPropertyValue("cols");
  }
  public set cols(val: number) {
    this.setPropertyValue("cols", val);
  }
  /**
   * Specifies whether the question's text area automatically expands its height to avoid the vertical scrollbar and to display the entire multi-line contents entered by respondents.  
   * Default value is false.  
   * @see SurveyModel.autoGrowComment
   */
  public get autoGrow(): boolean {
    return this.getPropertyValue("autoGrow") || (this.survey && this.survey.autoGrowComment);
  }
  public set autoGrow(val: boolean) {
    this.setPropertyValue("autoGrow", val);
  }
  public getType(): string {
    return "comment";
  }
  public afterRenderQuestionElement(el: HTMLElement) {
    this.element = document.getElementById(this.inputId) || el;
    this.updateElement();
  }
  public updateElement() {
    if (this.element && this.autoGrow) increaseHeightByContent(this.element);
  }
  onValueChanged() {
    super.onValueChanged();
    this.updateElement();
  }
}
Serializer.addClass(
  "comment",
  [
    { name: "maxLength:number", default: -1 },
    { name: "cols:number", default: 50 },
    { name: "rows:number", default: 4 },
    { name: "placeHolder", serializationProperty: "locPlaceHolder" },
    {
      name: "textUpdateMode",
      default: "default",
      choices: ["default", "onBlur", "onTyping"],
    },
    { name: "autoGrow:boolean" }
  ],
  function () {
    return new QuestionCommentModel("");
  },
  "textbase"
);
QuestionFactory.Instance.registerQuestion("comment", (name) => {
  return new QuestionCommentModel(name);
});
