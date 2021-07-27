import { Question } from "./question";
import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";
import { QuestionTextBase } from "./question_textbase";

/**
 * A Model for a comment question
 */
export class QuestionCommentModel extends QuestionTextBase {
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
  public getType(): string {
    return "comment";
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
  ],
  function() {
    return new QuestionCommentModel("");
  },
  "textbase"
);
QuestionFactory.Instance.registerQuestion("comment", (name) => {
  return new QuestionCommentModel(name);
});
