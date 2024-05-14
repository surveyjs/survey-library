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
  dropdownListModelValue: DropdownListModel;
  lastSelectedItemValue: ItemValue = null;

  updateReadOnlyText(): void {
    let result = !!this.selectedItem ? "" : this.placeholder;
    if(this.renderAs == "select") {
      if (this.isOtherSelected) {
        result = this.otherText;
      } else if (this.isNoneSelected) {
        result = this.noneText;
      } else if (!!this.selectedItem) {
        result = this.selectedItemText;
      }
    }
    this.readOnlyText = result;
  }

  constructor(name: string) {
    super(name);
    this.createLocalizableString("placeholder", this, false, true);
    this.createLocalizableString("clearCaption", this, false, true);
    this.registerPropertyChangedHandlers(["choicesMin", "choicesMax", "choicesStep"], () => {
      this.onVisibleChoicesChanged();
    });
    this.registerPropertyChangedHandlers(["value", "renderAs", "showOtherItem", "otherText", "placeholder", "choices", "visibleChoices"], () => {
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
  public get showClearButton(): boolean {
    return this.allowClear && !this.isEmpty() && (!this.isDesignMode || settings.supportCreatorV2);
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
  public get placeholder(): string {
    return this.getLocalizableStringText("placeholder");
  }
  public set placeholder(val: string) {
    this.setLocalizableStringText("placeholder", val);
  }
  get locPlaceholder(): LocalizableString {
    return this.getLocalizableString("placeholder");
  }

  public get clearCaption(): string {
    return this.getLocalizableStringText("clearCaption");
  }
  public set clearCaption(value: string) {
    this.setLocalizableStringText("clearCaption", value);
  }
  get locClearCaption(): LocalizableString {
    return this.getLocalizableString("clearCaption");
  }

  public getType(): string {
    return "dropdown";
  }
  public get ariaRole(): string {
    return "combobox";
  }
  public get selectedItem(): ItemValue { return this.getSingleSelectedItem(); }
  protected onGetSingleSelectedItem(selectedItemByValue: ItemValue): void {
    if(!!selectedItemByValue) {
      this.lastSelectedItemValue = selectedItemByValue;
    }
  }
  supportGoNextPageAutomatic(): boolean {
    return !this.isOtherSelected;
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
        this.minMaxChoices.push(this.createItemValue(i));
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

  public get autocomplete(): string {
    return this.getPropertyValue("autocomplete", "");
  }
  public set autocomplete(val: string) {
    this.setPropertyValue("autocomplete", val);
  }

  /**
   * Specifies whether to display a button that clears the selected value.
   */
  @property() allowClear: boolean;
  /**
   * Specifies whether users can enter a value into the input field to filter the drop-down list.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/create-dropdown-menu-in-javascript/ (linkStyle))
   * @see searchMode
   * @see [SurveyModel.onChoicesSearch](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onChoicesSearch)
   */
  @property({
    onSet: (newValue: boolean, target: QuestionDropdownModel) => {
      if (!!target.dropdownListModel) {
        target.dropdownListModel.setSearchEnabled(newValue);
      }
    }
  }) searchEnabled: boolean;

  /**
   * Specifies a comparison operation used to filter the drop-down list. Applies only if [`searchEnabled`](#searchEnabled) is `true`.
   *
   * Possible values:
   *
   * - `"contains"` (default)
   * - `"startsWith"`
   * @see [SurveyModel.onChoicesSearch](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onChoicesSearch)
   */
  @property() searchMode: "contains" | "startsWith";

  /**
   * Specifies whether to wrap long texts in choice options onto a new line.
   *
   * Default value: `true`
   *
   * Disable this property if you want the texts to be truncated with ellipsis.
   */
  @property() textWrapEnabled: boolean;
  @property({ defaultValue: false }) inputHasValue: boolean;
  @property({ defaultValue: "" }) readOnlyText: string;
  /**
   * Enables lazy loading. If you set this property to `true`, you should implement the Survey's [`onChoicesLazyLoad`](https://surveyjs.io/form-library/documentation/surveymodel#onChoicesLazyLoad) event handler.
   * @see choicesLazyLoadPageSize
   * @see SurveyModel.onChoicesLazyLoad
   */
  @property({
    onSet: (newValue: boolean, target: QuestionDropdownModel) => {
      if (!!target.dropdownListModel) {
        target.dropdownListModel.setChoicesLazyLoadEnabled(newValue);
      }
    }
  }) choicesLazyLoadEnabled: boolean;
  /**
   * Specifies the number of choice items to load at a time when choices are loaded on demand.
   * @see choicesLazyLoadEnabled
   * @see SurveyModel.onChoicesLazyLoad
   */
  @property() choicesLazyLoadPageSize: number;
  public getControlClass(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.control)
      .append(this.cssClasses.controlEmpty, this.isEmpty())
      .append(this.cssClasses.onError, this.hasCssError())
      .append(this.cssClasses.controlDisabled, this.isDisabledStyle)
      .append(this.cssClasses.controlReadOnly, this.isReadOnlyStyle)
      .append(this.cssClasses.controlPreview, this.isPreviewStyle)
      .append(this.cssClasses.controlInputFieldComponent, !!this.inputFieldComponentName)
      .toString();
  }

  @property() suggestedItem: ItemValue;
  public get selectedItemLocText() {
    const item = this.suggestedItem || this.selectedItem;
    return item?.locText;
  }
  public get inputFieldComponentName(): string {
    return this.inputFieldComponent || this.itemComponent;
  }
  public get showSelectedItemLocText(): boolean {
    return !this.inputHasValue && !this.inputFieldComponentName && !!this.selectedItemLocText && this.dropdownListModel.canShowSelectedItem;
  }
  public get showInputFieldComponent(): boolean {
    return !this.inputHasValue && !!this.inputFieldComponentName && !this.isEmpty();
  }
  private get selectedItemText(): string {
    const item = this.selectedItem;
    return !!item ? item.text : "";
  }
  public get dropdownListModel(): DropdownListModel {
    if (this.renderAs !== "select" && !this.dropdownListModelValue) {
      this.dropdownListModelValue = new DropdownListModel(this);
    }
    return this.dropdownListModelValue;
  }
  public set dropdownListModel(val: DropdownListModel) {
    this.dropdownListModelValue = val;
  }
  public get popupModel(): PopupModel {
    return this.dropdownListModel?.popupModel;
  }
  public get ariaExpanded(): string {
    const popupModel = this.popupModel;
    return !!popupModel && popupModel.isVisible ? "true" : "false";
  }

  public onOpened: EventBase<QuestionDropdownModel> = this.addEvent<QuestionDropdownModel>();
  public onOpenedCallBack(): void {
    this.onOpened.fire(this, { question: this, choices: this.choices });
  }
  protected onSelectedItemValuesChangedHandler(newValue: any): void {
    this.dropdownListModel?.setInputStringFromSelectedItem(newValue);
    super.onSelectedItemValuesChangedHandler(newValue);
  }
  protected hasUnknownValue(
    val: any,
    includeOther: boolean,
    isFilteredChoices: boolean,
    checkEmptyValue: boolean
  ): boolean {
    if(this.choicesLazyLoadEnabled) { return false; }
    return super.hasUnknownValue(val, includeOther, isFilteredChoices, checkEmptyValue);
  }
  protected needConvertRenderedOtherToDataValue(): boolean {
    const val = this.otherValue?.trim();
    if(!val) return false;
    return super.hasUnknownValue(val, true, false);
  }
  protected getItemIfChoicesNotContainThisValue(value: any, text?: string): any {
    if(this.choicesLazyLoadEnabled && !this.dropdownListModel.isAllDataLoaded) {
      return this.createItemValue(value, text);
    } else {
      return super.getItemIfChoicesNotContainThisValue(value, text);
    }
  }
  protected onVisibleChoicesChanged(): void {
    super.onVisibleChoicesChanged();

    if (!this.isLoadingFromJson && this.popupModel) {
      this.dropdownListModel.updateItems();
    }
  }

  protected getFirstInputElementId(): string {
    return this.inputId + (this.searchEnabled ? "_0" : "");
  }
  public getInputId() {
    return this.inputId + "_0";
  }
  public clearValue(): void {
    super.clearValue();
    this.lastSelectedItemValue = null;
    this.dropdownListModel?.clear();
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

  public dispose(): void {
    super.dispose();
    if(!!this.dropdownListModelValue) {
      this.dropdownListModelValue.dispose();
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
    { name: "autocomplete", alternativeName: "autoComplete", choices: settings.questions.dataList, },
    { name: "textWrapEnabled:boolean", default: true },
    { name: "renderAs", default: "default", visible: false },
    { name: "searchEnabled:boolean", default: true, visible: false },
    { name: "searchMode", default: "contains", choices: ["contains", "startsWith"], },
    { name: "choicesLazyLoadEnabled:boolean", default: false, visible: false },
    { name: "choicesLazyLoadPageSize:number", default: 25, visible: false },
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
