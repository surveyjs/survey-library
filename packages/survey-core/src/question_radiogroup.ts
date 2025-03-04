import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionCheckboxBase } from "./question_baseselect";
import { ItemValue } from "./itemvalue";
import { Action } from "./actions/action";
import { ComputedUpdater } from "./base";

/**
 * A class that describes the Radio Button Group question type.
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

  protected getFirstInputElementId(): string {
    return this.inputId + "_0";
  }
  /**
   * Returns the selected choice item. If no item is selected, returns `null`.
   */
  public get selectedItem(): ItemValue { return this.getSingleSelectedItem(); }
  /**
   * Specifies whether to display a button that clears the question value.
   *
   * Default value: `false`
   */
  public get allowClear(): boolean {
    return this.getPropertyValue("allowClear");
  }
  public set allowClear(val: boolean) {
    this.setPropertyValue("allowClear", val);
  }
  /**
   * @deprecated Use the [`allowClear`](https://surveyjs.io/form-library/documentation/api-reference/radio-button-question-model#allowClear) property instead.
   */
  public get showClearButton(): boolean {
    return this.allowClear;
  }
  public set showClearButton(val: boolean) {
    this.allowClear = val;
  }
  public get canShowClearButton(): boolean {
    return this.allowClear && !this.isReadOnly;
  }
  public get clearButtonCaption() {
    return this.getLocalizationString("clearCaption");
  }
  supportAutoAdvance(): boolean {
    return this.isMouseDown === true && !this.isOtherSelected;
  }
  public getConditionJson(operator: string = null, path: string = null): any {
    const json = super.getConditionJson(operator, path);
    delete json["allowClear"];
    delete json["showClearButton"];
    return json;
  }
  protected setNewComment(newValue: string): void {
    this.isMouseDown = true;
    super.setNewComment(newValue);
    this.isMouseDown = false;
  }
  public get showClearButtonInContent(): boolean {
    return !this.isDefaultV2Theme && this.canShowClearButton;
  }
  public clickItemHandler(item: ItemValue): void {
    if (this.isReadOnlyAttr) return;
    this.renderedValue = item.value;
  }

  protected getDefaultTitleActions(): Array<Action> {
    const actions = [];
    if(this.isDefaultV2Theme && !this.isDesignMode) {
      const clearAction = new Action(
        {
          locTitleName: "clearCaption",
          id: `sv-clr-btn-${this.id}`,
          action: () => { this.clearValue(true); },
          innerCss: this.cssClasses.clearButton,
          visible: <any>new ComputedUpdater(() => this.canShowClearButton)
        }
      );
      actions.push(clearAction);
    }
    return actions;
  }

  //a11y
  public get isNewA11yStructure(): boolean {
    return true;
  }
  public get a11y_input_ariaRole(): string {
    return "radiogroup";
  }
  // EO a11y
}

Serializer.addClass(
  "radiogroup",
  [
    { name: "allowClear:boolean", alternativeName: "showClearButton" },
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
