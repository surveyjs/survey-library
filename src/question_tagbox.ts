import { property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { QuestionCheckboxModel } from "./question_checkbox";
import { PopupModel } from "./popup";
import { DropdownMultiSelectListModel } from "./dropdownMultiSelectListModel";

/**
 * A Model for a tagbox question
 */
export class QuestionTagboxModel extends QuestionCheckboxModel {
  dropdownListModel: DropdownMultiSelectListModel;

  constructor(name: string) {
    super(name);
    this.createLocalizableString("placeholder", this, false, true);
  }

  public onSurveyLoad() {
    super.onSurveyLoad();
    if (!this.dropdownListModel) {
      this.dropdownListModel = new DropdownMultiSelectListModel(this);
    }
  }

  public get readOnlyText() {
    return this.selectedItems.length === 0 ? this.placeholder : this.selectedItems.map(item => item.text).join(", ");
  }

  /**
   * Specifies whether to display a button that clears the selected value.
   */
  @property({ defaultValue: true }) allowClear: boolean;
  /**
   * Specifies whether to display a search bar in the drop-down menu.
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
   * A text displayed in the input field when it doesn't have a value.
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
    return "tagbox";
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
  // public onOpened: EventBase<QuestionTagboxModel> = this.addEvent<QuestionTagboxModel>();
  // public onOpenedCallBack(): void {
  //   this.onOpened.fire(this, { question: this, choices: this.choices });
  // }

  protected onVisibleChoicesChanged(): void {
    super.onVisibleChoicesChanged();

    if (this.popupModel) {
      this.dropdownListModel.updateItems();
    }
  }
/*
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
  }*/
}

Serializer.addClass(
  "tagbox",
  [
    { name: "placeholder", serializationProperty: "locPlaceholder" },
    { name: "allowClear:boolean", default: true },
    { name: "searchEnabled:boolean", default: true },
    { name: "showSelectionControls:boolean", default: false },
    { name: "hideSelectedItems:boolean", default: false },
    { name: "itemComponent", visible: false }
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