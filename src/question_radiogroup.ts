import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionCheckboxBase } from "./question_baseselect";
import { surveyLocalization } from "./surveyStrings";
import { ItemValue } from "./itemvalue";

/**
 * A Model for a radiogroup question.
 */
export class QuestionRadiogroupModel extends QuestionCheckboxBase {
  constructor(name: string) {
    super(name);
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
  getItemClass(item: any) {
    var itemClass = this.cssClasses.item;
    var isDisabled = this.isReadOnly || !item.isEnabled;
    var isChecked =
      item.value === this.value ||
      (this.isOtherSelected && this.otherItem.value === item.value);
    var allowHover = !isDisabled && !isChecked;
    var isNone = item === this.noneItem;
    if (!this.hasColumns) {
      itemClass +=
        this.colCount === 0
          ? " " + this.cssClasses.itemInline
          : " sv-q-col-" + this.colCount;
    }
    if (isDisabled && !!this.cssClasses.itemDisabled)
      itemClass += " " + this.cssClasses.itemDisabled;
    if (isChecked && !!this.cssClasses.itemChecked)
      itemClass += " " + this.cssClasses.itemChecked;
    if (allowHover && !!this.cssClasses.itemHover)
      itemClass += " " + this.cssClasses.itemHover;
    if (isNone && !!this.cssClasses.itemNone)
      itemClass += " " + this.cssClasses.itemNone;
    return itemClass;
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
