import { JsonObject } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionSelectBase } from "./question_baseselect";
import { surveyLocalization } from "./surveyStrings";
import { LocalizableString } from "./localizablestring";

/**
 * A Model for a dropdown question
 */
export class QuestionDropdownModel extends QuestionSelectBase {
  constructor(public name: string) {
    super(name);
    this.createLocalizableString("optionsCaption", this);
  }
  /**
   * Use this property to set the options caption different from the default value. The default value is taken from localization strings.
   */
  public get optionsCaption() {
    return this.getLocalizableStringText(
      "optionsCaption",
      surveyLocalization.getString("optionsCaption")
    );
  }
  public set optionsCaption(val: string) {
    this.setLocalizableStringText("optionsCaption", val);
  }
  get locOptionsCaption(): LocalizableString {
    return this.getLocalizableString("optionsCaption");
  }
  public getType(): string {
    return "dropdown";
  }
  supportGoNextPageAutomatic() {
    return true;
  }
}
JsonObject.metaData.addClass(
  "dropdown",
  [{ name: "optionsCaption", serializationProperty: "locOptionsCaption" }],
  function() {
    return new QuestionDropdownModel("");
  },
  "selectbase"
);
QuestionFactory.Instance.registerQuestion("dropdown", name => {
  var q = new QuestionDropdownModel(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
