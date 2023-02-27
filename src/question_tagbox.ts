import { property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { QuestionCheckboxModel } from "./question_checkbox";
import { PopupModel } from "./popup";
import { DropdownMultiSelectListModel } from "./dropdownMultiSelectListModel";
import { EventBase } from "./base";
import { settings } from "./settings";

/**
 * A Model for a tagbox question
 *
 * [View Demo](https://surveyjs.io/form-library/examples/how-to-create-multiselect-tag-box/ (linkStyle))
 */
export class QuestionTagboxModel extends QuestionCheckboxModel {
  dropdownListModel: DropdownMultiSelectListModel;

  constructor(name: string) {
    super(name);
    this.createLocalizableString("placeholder", this, false, true);
    this.createLocalizableString("clearCaption", this, false, true);
  }

  protected getDefaultItemComponent(): string {
    return "";
  }

  public get readOnlyText() {
    return this.displayValue || this.placeholder;
  }

  public onSurveyLoad() {
    super.onSurveyLoad();
    if (!this.dropdownListModel) {
      this.dropdownListModel = new DropdownMultiSelectListModel(this);
    }
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
    defaultValue: false,
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
  @property({ defaultValue: false }) choicesLazyLoadEnabled: boolean;
  /**
   * Specifies the number of choice items to load at a time when choices are loaded on demand.
   * @see choicesLazyLoadEnabled
   * @see SurveyModel.onChoicesLazyLoad
   */
  @property({ defaultValue: 25 }) choicesLazyLoadPageSize: number;
  /**
   * Specifies whether to close the drop-down menu after a user selects a value.
   */
  @property({ getDefaultValue: () => { return settings.tagboxCloseOnSelect; } }) closeOnSelect: number;

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

  public getType(): string {
    return "tagbox";
  }
  public get ariaRole(): string {
    return "combobox";
  }
  public get popupModel(): PopupModel {
    return this.dropdownListModel?.popupModel;
  }

  public getControlClass(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.control)
      .append(this.cssClasses.controlEmpty, this.isEmpty())
      .append(this.cssClasses.onError, this.errors.length > 0)
      .append(this.cssClasses.controlDisabled, this.isReadOnly)
      .toString();
  }
  public onOpened: EventBase<QuestionTagboxModel> = this.addEvent<QuestionTagboxModel>();
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
}

Serializer.addClass(
  "tagbox",
  [
    { name: "placeholder", serializationProperty: "locPlaceholder" },
    { name: "allowClear:boolean", default: true },
    { name: "searchEnabled:boolean", default: true },
    { name: "choicesLazyLoadEnabled:boolean", default: false, visible: false },
    { name: "choicesLazyLoadPageSize:number", default: 25, visible: false },
    { name: "hideSelectedItems:boolean", default: false },
    { name: "closeOnSelect:boolean" },
    { name: "itemComponent", visible: false, default: "" }
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