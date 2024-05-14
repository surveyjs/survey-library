import { property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { QuestionCheckboxModel } from "./question_checkbox";
import { PopupModel } from "./popup";
import { DropdownMultiSelectListModel } from "./dropdownMultiSelectListModel";
import { EventBase } from "./base";
import { settings } from "./settings";
import { ItemValue } from "./itemvalue";

/**
 * A class that describes the Multi-Select Dropdown (Tag Box) question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/how-to-create-multiselect-tag-box/ (linkStyle))
 */
export class QuestionTagboxModel extends QuestionCheckboxModel {
  dropdownListModel: DropdownMultiSelectListModel;
  private itemDisplayNameMap: { [key: string]: string} = {};

  constructor(name: string) {
    super(name);
    this.createLocalizableString("placeholder", this, false, true);
    this.createLocalizableString("clearCaption", this, false, true);
    this.createLocalizableString("readOnlyText", this, true);
    this.registerPropertyChangedHandlers(["value", "renderAs", "showOtherItem", "otherText", "placeholder", "choices", "visibleChoices"], () => {
      this.updateReadOnlyText();
    });
    this.updateReadOnlyText();
  }
  public locStrsChanged(): void {
    super.locStrsChanged();
    this.updateReadOnlyText();
    this.dropdownListModel?.locStrsChanged();
  }
  private updateReadOnlyText(): void {
    this.readOnlyText = this.displayValue || this.placeholder;
  }
  protected getDefaultItemComponent(): string {
    return "";
  }
  public onSurveyLoad(): void {
    super.onSurveyLoad();
    this.createDropdownListModel();
  }
  protected onSetData(): void {
    super.onSetData();
    this.createDropdownListModel();
  }
  private createDropdownListModel(): void {
    if (!this.dropdownListModel && !this.isLoadingFromJson) {
      this.dropdownListModel = new DropdownMultiSelectListModel(this);
    }
  }
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
   * Specifies whether to display a button that clears the selected value.
   */
  @property() allowClear: boolean;
  /**
   * Specifies whether users can enter a value into the input field to filter the drop-down list.
   */
  @property({
    onSet: (newValue: boolean, target: QuestionTagboxModel) => {
      if (!!target.dropdownListModel) {
        target.dropdownListModel.setSearchEnabled(newValue);
      }
    }
  }) searchEnabled: boolean;

  /**
   * Specifies whether to remove selected items from the drop-down list.
   */
  @property({
    onSet: (newValue: boolean, target: QuestionTagboxModel) => {
      if (!!target.dropdownListModel) {
        target.dropdownListModel.setHideSelectedItems(newValue);
      }
    }
  })
  hideSelectedItems: boolean;
  /**
   * Enables lazy loading. If you set this property to `true`, you should implement the Survey's [`onChoicesLazyLoad`](https://surveyjs.io/form-library/documentation/surveymodel#onChoicesLazyLoad) event handler.
   * @see choicesLazyLoadPageSize
   * @see SurveyModel.onChoicesLazyLoad
   */
  @property({
    onSet: (newValue: boolean, target: QuestionTagboxModel) => {
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
  /**
   * Specifies whether to close the drop-down menu after a user selects a value.
   */
  @property({ getDefaultValue: () => { return settings.tagboxCloseOnSelect; } }) closeOnSelect: number;

  @property() textWrapEnabled: boolean;

  /**
   * A text displayed in the input field when it doesn't have a value.
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

  public get readOnlyText(): string {
    return this.getLocalizableStringText("readOnlyText");
  }
  public set readOnlyText(val: string) {
    this.setLocalizableStringText("readOnlyText", val);
  }
  get locReadOnlyText(): LocalizableString {
    return this.getLocalizableString("readOnlyText");
  }

  public getType(): string {
    return "tagbox";
  }
  public get ariaRole(): string {
    return "combobox";
  }
  public get popupModel(): PopupModel {
    return this.dropdownListModel?.popupModel;
  }
  public get ariaExpanded(): string {
    const popupModel = this.popupModel;
    return !!popupModel && popupModel.isVisible ? "true" : "false";
  }

  public getControlClass(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.control)
      .append(this.cssClasses.controlEmpty, this.isEmpty())
      .append(this.cssClasses.onError, this.hasCssError())
      .append(this.cssClasses.controlEditable, !this.isDisabledStyle && !this.isReadOnlyStyle && !this.isPreviewStyle)
      .append(this.cssClasses.controlDisabled, this.isDisabledStyle)
      .append(this.cssClasses.controlReadOnly, this.isReadOnlyStyle)
      .append(this.cssClasses.controlPreview, this.isPreviewStyle)
      .toString();
  }
  public onOpened: EventBase<QuestionTagboxModel> = this.addEvent<QuestionTagboxModel>();
  public onOpenedCallBack(): void {
    this.onOpened.fire(this, { question: this, choices: this.choices });
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
  protected onVisibleChoicesChanged(): void {
    super.onVisibleChoicesChanged();

    if (this.popupModel) {
      this.dropdownListModel.updateItems();
    }
  }
  protected getItemIfChoicesNotContainThisValue(value: any, text?: string): any {
    if(this.choicesLazyLoadEnabled && !this.dropdownListModel?.isAllDataLoaded) {
      return this.createItemValue(value, text);
    } else {
      return super.getItemIfChoicesNotContainThisValue(value, text);
    }
  }
  protected validateItemValues(itemValues: Array<ItemValue>): Array<ItemValue> {
    this.updateItemDisplayNameMap();
    const val = this.renderedValue as Array<any>;
    if(!!itemValues.length && itemValues.length === val.length) return itemValues;

    const selectedItemValues = this.selectedItemValues;
    if(!itemValues.length && !!selectedItemValues && !!selectedItemValues.length) {
      this.defaultSelectedItemValues = [].concat(selectedItemValues);
      return selectedItemValues;
    }

    const itemValueValues = itemValues.map(iV => iV.value);
    val.filter(item => { return itemValueValues.indexOf(item) === -1; }).forEach(item => {
      const newItem = this.getItemIfChoicesNotContainThisValue(item, this.itemDisplayNameMap[item]);
      if(newItem) {
        itemValues.push(newItem);
      }
    });
    itemValues.sort((a, b) => { return val.indexOf(a.value) - val.indexOf(b.value); });
    return itemValues;
  }

  updateItemDisplayNameMap(): void {
    const func = (item: ItemValue) => { this.itemDisplayNameMap[item.value] = item.text; };
    (this.defaultSelectedItemValues || []).forEach(func);
    (this.selectedItemValues as Array<ItemValue> || []).forEach(func);
    this.visibleChoices.forEach(func);
  }

  protected getFirstInputElementId(): string {
    return this.inputId + (this.searchEnabled ? "_0" : "");
  }
  public getInputId() {
    return this.inputId + "_0";
  }
  public dispose(): void {
    super.dispose();
    if(!!this.dropdownListModel) {
      this.dropdownListModel.dispose();
    }
  }
  public clearValue(): void {
    super.clearValue();
    this.dropdownListModel?.clear();
  }
  public get showClearButton(): boolean {
    return this.allowClear && !this.isEmpty() && (!this.isDesignMode || settings.supportCreatorV2);
  }
  //a11y
  public get isNewA11yStructure(): boolean {
    return false;
  }
  // EO a11y
}

Serializer.addClass(
  "tagbox",
  [
    { name: "placeholder", serializationProperty: "locPlaceholder" },
    { name: "allowClear:boolean", default: true },
    { name: "searchEnabled:boolean", default: true },
    { name: "textWrapEnabled:boolean", default: true },
    { name: "choicesLazyLoadEnabled:boolean", default: false, visible: false },
    { name: "choicesLazyLoadPageSize:number", default: 25, visible: false },
    { name: "hideSelectedItems:boolean", default: false },
    { name: "closeOnSelect:boolean" },
    { name: "itemComponent", visible: false, default: "" },
    { name: "searchMode", default: "contains", choices: ["contains", "startsWith"] }
  ],
  function () {
    return new QuestionTagboxModel("");
  },
  "checkbox"
);

QuestionFactory.Instance.registerQuestion("tagbox", (name) => {
  const q = new QuestionTagboxModel(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});