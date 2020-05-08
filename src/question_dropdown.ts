import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionSelectBase } from "./question_baseselect";
import { surveyLocalization } from "./surveyStrings";
import { LocalizableString } from "./localizablestring";
import { ItemValue } from "./itemvalue";

/**
 * A Model for a dropdown question
 */
export class QuestionDropdownModel extends QuestionSelectBase {
  constructor(public name: string) {
    super(name);
    this.createLocalizableString("optionsCaption", this);
    var self = this;
    this.registerFunctionOnPropertiesValueChanged(
      ["choicesMin", "choicesMax", "choicesStep"],
      function () {
        self.onVisibleChoicesChanged();
      }
    );
  }
  /**
   * This flag controls whether to show options caption item ('Choose...').
   */
  public get showOptionsCaption(): boolean {
    return this.getPropertyValue("showOptionsCaption", true);
  }
  public set showOptionsCaption(val: boolean) {
    this.setPropertyValue("showOptionsCaption", val);
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
  public get selectedItem(): ItemValue {
    if (this.isEmpty()) return null;
    return ItemValue.getItemByValue(this.visibleChoices, this.value);
  }
  supportGoNextPageAutomatic() {
    return true;
  }
  private minMaxChoices = <Array<ItemValue>>[];
  protected getChoices(): Array<ItemValue> {
    var items = super.getChoices();
    if (this.choicesMax <= this.choicesMin) return items;
    var res = [];
    for (var i = 0; i < items.length; i++) {
      res.push(items[i]);
    }
    if (
      this.minMaxChoices.length === 0 ||
      this.minMaxChoices.length !==
        (this.choicesMax - this.choicesMin) / this.choicesStep + 1
    ) {
      this.minMaxChoices = [];
      for (
        var i = this.choicesMin;
        i <= this.choicesMax;
        i += this.choicesStep
      ) {
        this.minMaxChoices.push(new ItemValue(i));
      }
    }
    res = res.concat(this.minMaxChoices);
    return res;
  }
  /**
   * Use this and choicesMax property to automatically add choices. For example choicesMin = 1 and choicesMax = 10 will generate ten additional choices from 1 to 10.
   * @see choicesMax
   * @see choicesStep
   */
  public get choicesMin(): number {
    return this.getPropertyValue("choicesMin", 0);
  }
  public set choicesMin(val: number) {
    this.setPropertyValue("choicesMin", val);
  }
  /**
   * Use this and choicesMax property to automatically add choices. For example choicesMin = 1 and choicesMax = 10 will generate ten additional choices from 1 to 10.
   * @see choicesMin
   * @see choicesStep
   */
  public get choicesMax(): number {
    return this.getPropertyValue("choicesMax", 0);
  }
  public set choicesMax(val: number) {
    this.setPropertyValue("choicesMax", val);
  }
  /**
   * The default value is 1. It tells the value of the iterator between choicesMin and choicesMax properties.
   * If choicesMin = 10, choicesMax = 30 and choicesStep = 10 then you will have only three additional choices: [10, 20, 30].
   * @see choicesMin
   * @see choicesMax
   */
  public get choicesStep(): number {
    return this.getPropertyValue("choicesStep", 1);
  }
  public set choicesStep(val: number) {
    if (val < 1) val = 1;
    this.setPropertyValue("choicesStep", val);
  }
}
Serializer.addClass(
  "dropdown",
  [
    { name: "optionsCaption", serializationProperty: "locOptionsCaption" },
    { name: "showOptionsCaption:boolean", default: true },
    { name: "choicesMin:number", default: 0 },
    { name: "choicesMax:number", default: 0 },
    { name: "choicesStep:number", default: 1, minValue: 1 },
  ],
  function () {
    return new QuestionDropdownModel("");
  },
  "selectbase"
);
QuestionFactory.Instance.registerQuestion("dropdown", (name) => {
  var q = new QuestionDropdownModel(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
