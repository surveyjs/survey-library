import { JsonObject } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionCheckboxBase } from "./question_baseselect";
import { surveyLocalization } from "./surveyStrings";

/**
 * A Model for a radiogroup question.
 */
export class QuestionRadiogroupModel extends QuestionCheckboxBase {
  constructor(public name: string) {
    super(name);
  }
  public getType(): string {
    return "radiogroup";
  }
  protected getFirstInputElementId(): string {
    return this.inputId + "_0";
  }
  /**
   * Show "clear button" flag.
   */
  public get showClearButton(): boolean {
    return this.getPropertyValue("showClearButton", false);
  }
  public set showClearButton(val: boolean) {
    this.setPropertyValue("showClearButton", val);
  }
  public get clearButtonCaption() {
    return surveyLocalization.getString("clearCaption");
  }
  supportGoNextPageAutomatic() {
    return true;
  }
}

JsonObject.metaData.addClass(
  "radiogroup",
  [{ name: "showClearButton:boolean", default: false }],
  function() {
    return new QuestionRadiogroupModel("");
  },
  "checkboxbase"
);

QuestionFactory.Instance.registerQuestion("radiogroup", name => {
  var q = new QuestionRadiogroupModel(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
