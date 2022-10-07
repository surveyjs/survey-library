import { property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionSelectBase } from "./question_baseselect";
import { LocalizableString } from "./localizablestring";
import { ItemValue } from "./itemvalue";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { PopupModel } from "./popup";
import { EventBase } from "./base";
import { DropdownListModel } from "./dropdownListModel";
import { settings } from "./settings";

/**
 * A class that describes the Dropdown question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-dropdown/ (linkStyle))
 */
export class QuestionDropdownModel extends QuestionSelectBase {
  dropdownListModel: DropdownListModel;

  updateReadOnlyText(): void {
    let result = this.placeholder;
    if (this.hasOther && this.isOtherSelected) {
      result = this.otherText;
    } else if (!!this.selectedItem) {
      result = this.renderAs == "select" ? this.selectedItemText : "";
    }
    this.readOnlyText = result;
  }

  constructor(name: string) {
    super(name);
    this.createLocalizableString("placeholder", this, false, true);
    this.registerPropertyChangedHandlers(["choicesMin", "choicesMax", "choicesStep"], () => {
      this.onVisibleChoicesChanged();
    });
    this.registerPropertyChangedHandlers(["value", "renderAs", "showOtherItem", "otherText", "placeholder"], () => {
      this.updateReadOnlyText();
    });
    this.updateReadOnlyText();
  }
  public locStrsChanged(): void {
    super.locStrsChanged();
    this.updateReadOnlyText();
  }
  public get showOptionsCaption(): boolean {
    return this.allowClear;
  }
  public set showOptionsCaption(val: boolean) {
    this.allowClear = val;
  }
  public get optionsCaption() {
    return this.placeholder;
  }
  public set optionsCaption(val: string) {
    this.placeholder = val;
  }
  /**
   * A placeholder for the input field.
   */
  public get placeholder() {
    return this.getLocalizableStringText("placeholder");
  }
  set placeholder(val: string) {
    this.setLocalizableStringText("placeholder", val);
  }
  get locPlaceholder(): LocalizableString {
    return this.getLocalizableString("placeholder");
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
   * Use the `choicesMin`, `choicesMax`, and `choicesStep` properties to generate choice items automatically. For example, the configuration below generates three choice items: [10, 20, 30].
   *
   * ```js
   * "choicesMin": 10,
   * "choicesMax": 30
   * "choicesStep": 10
   * ```
   * @see choicesMax
   * @see choicesStep
   */
  public get choicesMin(): number {
    return this.getPropertyValue("choicesMin");
  }
  public set choicesMin(val: number) {
    this.setPropertyValue("choicesMin", val);
  }
  /**
   * Use the `choicesMin`, `choicesMax`, and `choicesStep` properties to generate choice items automatically. For example, the configuration below generates three choice items: [10, 20, 30].
   *
   * ```js
   * "choicesMin": 10,
   * "choicesMax": 30
   * "choicesStep": 10
   * ```
   * @see choicesMin
   * @see choicesStep
   */
  public get choicesMax(): number {
    return this.getPropertyValue("choicesMax");
  }
  public set choicesMax(val: number) {
    this.setPropertyValue("choicesMax", val);
  }
  /**
   * Use the `choicesMin`, `choicesMax`, and `choicesStep` properties to generate choice items automatically. For example, the configuration below generates three choice items: [10, 20, 30].
   *
   * ```js
   * "choicesMin": 10,
   * "choicesMax": 30
   * "choicesStep": 10
   * ```
   *
   * The default value of the `choicesStep` property is 1.
   * @see choicesMin
   * @see choicesMax
   */
  public get choicesStep(): number {
    return this.getPropertyValue("choicesStep");
  }
  public set choicesStep(val: number) {
    if (val < 1) val = 1;
    this.setPropertyValue("choicesStep", val);
  }
  /**
   * An [autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) attribute value for the underlying `<input>` element.
   */
  public get autoComplete(): string {
    return this.getPropertyValue("autoComplete", "");
  }
  public set autoComplete(val: string) {
    this.setPropertyValue("autoComplete", val);
  }

  /**
   * Specifies whether to display a button that clears the selected value.
   */
  @property({ defaultValue: true }) allowClear: boolean;
  /**
   * Specifies whether users can enter a value into the input field to filter the drop-down list.
   */
  @property({
    defaultValue: true,
    onSet: (newValue: boolean, target: QuestionDropdownModel) => {
      if (!!target.dropdownListModel) {
        target.dropdownListModel.setSearchEnabled(newValue);
      }
    }
  }) searchEnabled: boolean;
  /**
   * The clean files button caption.
   */
  @property({ localizable: { defaultStr: "cleanCaption" } }) cleanButtonCaption: string;
  @property({ defaultValue: false }) inputHasValue: boolean;
  @property({ defaultValue: "" }) readOnlyText: string;

  public getControlClass(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.control)
      .append(this.cssClasses.controlEmpty, this.isEmpty())
      .append(this.cssClasses.onError, this.errors.length > 0)
      .append(this.cssClasses.controlDisabled, this.isReadOnly)
      .append(this.cssClasses.controlInputFieldComponent, !!this.inputFieldComponentName)
      .toString();
  }
  public get selectedItemLocText() {
    const item = this.selectedItem;
    return item?.locText;
  }
  public get inputFieldComponentName(): string {
    return this.inputFieldComponent || this.itemComponent;
  }
  public get showSelectedItemLocText(): boolean {
    return !this.inputHasValue && !this.inputFieldComponentName && !!this.selectedItemLocText;
  }
  public get showInputFieldComponent(): boolean {
    return !this.inputHasValue && !!this.inputFieldComponentName && !this.isEmpty();
  }
  private get selectedItemText(): string {
    const item = this.selectedItem;
    return !!item ? item.text : "";
  }
  public get popupModel(): PopupModel {
    if (this.renderAs !== "select" && !this.dropdownListModel) {
      this.dropdownListModel = new DropdownListModel(this);
    }
    return this.dropdownListModel?.popupModel;
  }

  public onOpened: EventBase<QuestionDropdownModel> = this.addEvent<QuestionDropdownModel>();
  public onOpenedCallBack(): void {
    this.onOpened.fire(this, { question: this, choices: this.choices });
  }

  protected onVisibleChoicesChanged(): void {
    super.onVisibleChoicesChanged();

    if (this.popupModel) {
      this.dropdownListModel.updateItems();
    }
  }

  protected getFirstInputElementId(): string {
    return this.inputId + (this.searchEnabled ? "_0" : "");
  }
  public getInputId() {
    return this.inputId + "_0";
  }

  onClick(e: any): void {
    !!this.onOpenedCallBack && this.onOpenedCallBack();
  }

  onKeyUp(event: any): void {
    const char: number = event.which || event.keyCode;
    if (char === 46) {
      this.clearValue();
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
Serializer.addClass(
  "dropdown",
  [
    { name: "placeholder", alternativeName: "optionsCaption", serializationProperty: "locPlaceholder" },
    { name: "allowClear:boolean", alternativeName: "showOptionsCaption", default: true },
    { name: "choicesMin:number", default: 0 },
    { name: "choicesMax:number", default: 0 },
    { name: "choicesStep:number", default: 1, minValue: 1 },
    { name: "autoComplete", choices: settings.questions.dataList, },
    { name: "renderAs", default: "default", visible: false },
    { name: "searchEnabled:boolean", default: true, visible: false },
    { name: "inputFieldComponent", visible: false },
    { name: "itemComponent", visible: false, default: "" }
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
