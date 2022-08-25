import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionCheckboxBase } from "./question_baseselect";
import { surveyLocalization } from "./surveyStrings";
import { ItemValue } from "./itemvalue";
import { Action } from "./actions/action";
import { ComputedUpdater } from "./base";

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
   * Return the selected item in the radio group. Returns null if the value is empty
   */
  public get selectedItem(): ItemValue {
    if (this.isEmpty()) return null;
    return ItemValue.getItemByValue(this.visibleChoices, this.value);
  }
  /**
   * Show "clear button" flag.
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
    { name: "separateSpecialChoices", visible: true }],
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
