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
import { updateListCssValues } from "./utils/utils";
import { Helpers } from "./helpers";
import { questionDropdownMixin } from "./question_dropdown_mixin";

/**
 * A class that describes the Multi-Select Dropdown (Tag Box) question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/how-to-create-multiselect-tag-box/ (linkStyle))
 */
export class QuestionTagboxModel extends questionDropdownMixin(QuestionCheckboxModel) {
  private itemDisplayNameMap: { [key: string]: string} = {};

  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    const resetReadOnlyTextProps = ["value", "renderAs", "showOtherItem", "otherText", "placeholder", "choices", "visibleChoices"];
    if (resetReadOnlyTextProps.indexOf(name) > -1) {
      this.resetReadOnlyText();
    }
    if (name === "placeholder" && !!this.dropdownListModelValue) {
      this.dropdownListModel.setInputPlaceholder(newValue);
    }
  }
  supportElementsInChoice(): boolean { return false; }
  public locStrsChanged(): void {
    super.locStrsChanged();
    this.resetReadOnlyText();
    this.dropdownListModelValue?.locStrsChanged();
  }
  protected getDefaultItemComponent(): string {
    return "";
  }
  public get dropdownListModel(): DropdownMultiSelectListModel {
    if (!this.isDisposed && !this.dropdownListModelValue) {
      this.dropdownListModelValue = new DropdownMultiSelectListModel(this);
    }
    return this.dropdownListModelValue as DropdownMultiSelectListModel;
  }
  public set dropdownListModel(val: DropdownMultiSelectListModel) {
    this.dropdownListModelValue = val;
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
   * Specifies whether users can add their own choices if the desired option isn't available in the dropdown.
   *
   * Default value: `false`
   *
   *>  Custom choices will only be stored temporarily for the duration of the current browser session. If you want to save them in a data storage, handle the [`onCreateCustomChoiceItem`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onCreateCustomChoiceItem) event.
   */
  @property({
    onSet: (newValue: boolean, target: QuestionTagboxModel) => {
      if (!!target.dropdownListModelValue) {
        target.dropdownListModel.setAllowCustomChoices(newValue);
      }
    }
  }) allowCustomChoices: boolean;

  /**
   * Specifies whether to display a button that clears the selected value.
   */
  @property() allowClear: boolean;
  /**
   * Specifies whether users can enter a value into the input field to filter the drop-down list.
   */
  @property({
    onSet: (newValue: boolean, target: QuestionTagboxModel) => {
      if (!!target.dropdownListModelValue) {
        target.dropdownListModel.setSearchEnabled(newValue);
      }
    }
  }) searchEnabled: boolean;

  /**
   * Specifies whether to remove selected items from the drop-down list.
   */
  @property({
    onSet: (newValue: boolean, target: QuestionTagboxModel) => {
      if (!!target.dropdownListModelValue) {
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
      if (!!target.dropdownListModelValue) {
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
  @property({ localizable: { defaultStr: true } }) placeholder: string;
  public getType(): string {
    return "tagbox";
  }
  public supportMultipleComment(item: ItemValue): boolean { return this.isOtherValue(item.value); }
  public get a11yInputAriaRole(): string | null {
    return "combobox";
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
  protected updateCssClasses(res: any, css: any): void {
    super.updateCssClasses(res, css);
    updateListCssValues(res, css);
  }
  public onOpened: EventBase<QuestionTagboxModel> = this.addEvent<QuestionTagboxModel>();

  protected validateItemValues(itemValues: Array<ItemValue>): Array<ItemValue> {
    this.updateItemDisplayNameMap();
    const val = this.renderedValue as Array<any>;
    if (!!itemValues.length && itemValues.length === val.length) return itemValues;

    const selectedItemValues = this.selectedItemValues;
    if (!itemValues.length && !!selectedItemValues && !!selectedItemValues.length) {
      this.defaultSelectedItemValues = [].concat(selectedItemValues);
      return selectedItemValues;
    }

    const itemValueValues = itemValues.map(iV => iV.value);
    val.filter(item => { return itemValueValues.indexOf(item) === -1; }).forEach(item => {
      const newItem = this.getItemIfChoicesNotContainThisValue(item, this.itemDisplayNameMap[item]);
      if (newItem) {
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

  protected updateCustomChoices(value: any, items: Array<ItemValue>): void {
    if (value !== undefined && value !== null && value.length > 0 && this.allowCustomChoices && !this.choicesLazyLoadEnabled) {
      this.customChoices.splice(0, this.customChoices.length);
      const newArr = [];
      value.forEach(v => {
        const item = items.filter(ch => Helpers.isTwoValueEquals(ch.id, v, false, false))[0];
        if (!item) {
          newArr.push(new ItemValue(v));
        }
      });
      if (newArr.length > 0) {
        this.customChoices.splice(0, this.customChoices.length, ...newArr);
      }
    }
  }

  protected getFirstInputElementId(): string {
    return this.inputId + (this.searchEnabled || this.allowCustomChoices ? "_0" : "");
  }
  public getInputId(): string {
    return this.inputId + "_0";
  }
  protected allElementsSelected(): boolean {
    const result = super.allElementsSelected();
    this.updateSelectAllItemText(result);
    return result;
  }

  public updateSelectAllItemText(isAllSelected: boolean): void {
    this.selectAllTextValue = this.selectAllTextValue || this.locSelectAllText;
    this.selectAllItem.setLocText(isAllSelected ? this.deselectAllText() : this.selectAllTextValue);
  }
  private selectAllTextValue: LocalizableString;
  private deselectAllTextValue: LocalizableString;
  private deselectAllText(): LocalizableString {
    if (!this.deselectAllTextValue) {
      this.deselectAllTextValue = this.createLocalizableString("deselectAllText", this.selectAllItem, true, "deselectAllItemText");
    }
    return this.deselectAllTextValue;
  }

}

Serializer.addClass(
  "tagbox",
  [
    { name: "placeholder", serializationProperty: "locPlaceholder" },
    { name: "allowClear:boolean", default: true },
    { name: "searchEnabled:boolean", default: true },
    {
      name: "allowCustomChoices:boolean", default: false,
      visibleIf: (obj: any): boolean => !obj.choicesFromQuestion, dependsOn: "choicesFromQuestion"
    },
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