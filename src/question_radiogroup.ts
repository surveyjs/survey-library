import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionCheckboxBase } from "./question_baseselect";
import { surveyLocalization } from "./surveyStrings";
import { ItemValue } from "./itemvalue";
import { Action } from "./actions/action";
import { ComputedUpdater } from "./base";

/**
 * A class that describes the Radiogroup question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-radiogroup/ (linkStyle))
 */
export class QuestionRadiogroupModel extends QuestionCheckboxBase {
  constructor(name: string) {
    super(name);
  }
  protected getDefaultItemComponent(): string {
    return "survey-radiogroup-item";
  }
  public getType(): string {
    return "radiogroup";
  }

  public get ariaRole(): string {
    return "radiogroup";
  }
  public get titleAriaLabel(): string | null {
    return null;
  }
  protected getFirstInputElementId(): string {
    return this.inputId + "_0";
  }
  /**
   * Returns the selected choice item. If no item is selected, returns `null`.
   */
  public get selectedItem(): ItemValue {
    const selectedItemValues = this.selectedItemValues;
    if (this.isEmpty()) return null;

    const itemValue = ItemValue.getItemByValue(this.visibleChoices, this.value);
    if(!itemValue && !selectedItemValues) {
      this.updateSelectedItemValues();
    }
    return itemValue || selectedItemValues || new ItemValue(this.value);
  }
  /**
   * Specifies whether to display a button that clears the question value.
   *
   * Default value: `false`
   */
  public get showClearButton(): boolean {
    return this.getPropertyValue("showClearButton");
  }
  public set showClearButton(val: boolean) {
    this.setPropertyValue("showClearButton", val);
  }
  public get canShowClearButton(): boolean {
    return this.showClearButton && !this.isReadOnly;
  }
  public get clearButtonCaption() {
    return this.getLocalizationString("clearCaption");
  }
  supportGoNextPageAutomatic() {
    return true;
  }
  public get showClearButtonInContent(): boolean {
    return !this.isDefaultV2Theme && this.canShowClearButton;
  }
  public clickItemHandler(item: ItemValue): void {
    this.renderedValue = item.value;
  }

  protected getDefaultTitleActions(): Array<Action> {
    const actions = [];
    if(this.isDefaultV2Theme && !this.isDesignMode) {
      const clearAction = new Action(
        {
          title: this.clearButtonCaption,
          id: `sv-clr-btn-${this.id}`,
          action: () => { this.clearValue(); },
          innerCss: this.cssClasses.clearButton,
          visible: <any>new ComputedUpdater(() => this.canShowClearButton)
        }
      );
      actions.push(clearAction);
    }
    return actions;
  }
}

Serializer.addClass(
  "radiogroup",
  [{ name: "showClearButton:boolean", default: false },
    { name: "separateSpecialChoices", visible: true },
    { name: "itemComponent", visible: false, default: "survey-radiogroup-item" }
  ],
  function () {
    return new QuestionRadiogroupModel("");
  },
  "checkboxbase"
);

QuestionFactory.Instance.registerQuestion("radiogroup", (name) => {
  var q = new QuestionRadiogroupModel(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
