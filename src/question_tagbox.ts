import { property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { QuestionCheckboxModel } from "./question_checkbox";
import { PopupModel } from "./popup";
import { DropdownMultiSelectListModel } from "./dropdownMultiSelectListModel";
import { EventBase } from "./base";

/**
 * A Model for a tagbox question
 */
export class QuestionTagboxModel extends QuestionCheckboxModel {
  dropdownListModel: DropdownMultiSelectListModel;

  constructor(name: string) {
    super(name);
    this.createLocalizableString("placeholder", this, false, true);
  }

  public get readOnlyText() {
    return this.placeholder;
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
// QuestionFactory.Instance.registerQuestion("tagbox", (name) => {
//   const q = new QuestionTagboxModel(name);
//   q.choices = QuestionFactory.DefaultChoices;
//   return q;
// });