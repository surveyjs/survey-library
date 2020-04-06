import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionCheckboxBase } from "./question_baseselect";
import { surveyLocalization } from "./surveyStrings";
import { ItemValue } from "./itemvalue";

/**
 * A Model for a radiogroup question.
 */
export class QuestionRadiogroupModel extends QuestionCheckboxBase {
  constructor(public name: string) {
    super(name);
  }
  public get ariaRole(): string {
    return "radiogroup";
  }
  public getType(): string {
    return "radiogroup";
  }
  protected getFirstInputElementId(): string {
    return this.inputId + "_0";
  }
  public get selectedItem(): ItemValue {
    if (this.isEmpty()) return null;
    return ItemValue.getItemByValue(this.visibleChoices, this.value);
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
  public get canShowClearButton(): boolean {
    return this.showClearButton && !this.isReadOnly;
  }
  public get clearButtonCaption() {
    return surveyLocalization.getString("clearCaption");
  }
  supportGoNextPageAutomatic() {
    return true;
  }
}

Serializer.addClass(
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
