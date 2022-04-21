import { property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionSelectBase } from "./question_baseselect";
import { surveyLocalization } from "./surveyStrings";
import { LocalizableString } from "./localizablestring";
import { ItemValue } from "./itemvalue";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { PopupModel } from "./popup";
import { ListModel } from "./list";
import { IAction } from "./actions/action";

/**
 * A Model for a dropdown question
 */
export class QuestionDropdownModel extends QuestionSelectBase {
  private getVisibleListItems() {
    return this.visibleChoices.map((choice: ItemValue) => <IAction>{
      id: choice.value,
      title: choice.text,
      visible: choice.isVisible,
      enabled: choice.isEnabled,
    });
  }
  constructor(name: string) {
    super(name);
    this.createLocalizableString("optionsCaption", this, false, true);
    var self = this;
    this.registerFunctionOnPropertiesValueChanged(
      ["choicesMin", "choicesMax", "choicesStep"],
      function () {
        self.onVisibleChoicesChanged();
      }
    );
  }
  /**
   * This flag controls whether to show options caption item ('Choose...').
   */
  public get showOptionsCaption(): boolean {
    return this.getPropertyValue("showOptionsCaption");
  }
  public set showOptionsCaption(val: boolean) {
    this.setPropertyValue("showOptionsCaption", val);
  }
  /**
   * Use this property to set the options caption different from the default value. The default value is taken from localization strings.
   */
  public get optionsCaption() {
    return this.getLocalizableStringText("optionsCaption");
  }
  public set optionsCaption(val: string) {
    this.setLocalizableStringText("optionsCaption", val);
  }
  get locOptionsCaption(): LocalizableString {
    return this.getLocalizableString("optionsCaption");
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
   * Use this and choicesMax property to automatically add choices. For example choicesMin = 1 and choicesMax = 10 will generate ten additional choices from 1 to 10.
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
   * Use this and choicesMax property to automatically add choices. For example choicesMin = 1 and choicesMax = 10 will generate ten additional choices from 1 to 10.
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
   * The default value is 1. It tells the value of the iterator between choicesMin and choicesMax properties.
   * If choicesMin = 10, choicesMax = 30 and choicesStep = 10 then you will have only three additional choices: [10, 20, 30].
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
   * Dropdown auto complete
   */
  public get autoComplete(): string {
    return this.getPropertyValue("autoComplete", "");
  }
  public set autoComplete(val: string) {
    this.setPropertyValue("autoComplete", val);
  }

  @property({
    defaultValue: false,
    onSet: (newValue: boolean, target: QuestionDropdownModel) => {
      if (!!target.popupModel && target.popupModel.contentComponentData.model instanceof ListModel) {
        const listModel = target.popupModel.contentComponentData.model as ListModel;
        listModel.denySearch = newValue;
      }
    }
  }) denySearch: boolean;
  @property({
    defaultValue: "editorWidth",
    onSet: (newValue: "contentWidth" | "editorWidth", target: QuestionDropdownModel) => {
      if (!!target.popupModel) {
        target.popupModel.widthMode = (newValue === "editorWidth") ? "fixedWidth" : "contentWidth";
      }
    }
  }) dropdownWidthMode: "contentWidth" | "editorWidth";

  public getControlClass(): string {
    this.isEmpty();
    return new CssClassBuilder()
      .append(this.cssClasses.control)
      .append(this.cssClasses.controlEmpty, this.isEmpty())
      .append(this.cssClasses.onError, this.errors.length > 0)
      .append(this.cssClasses.controlDisabled, this.isReadOnly)
      .toString();
  }
  public get readOnlyText() {
    return this.hasOther && this.isOtherSelected ? this.otherText : (this.displayValue || this.showOptionsCaption && this.optionsCaption);
  }

  protected onVisibleChoicesChanged(): void {
    super.onVisibleChoicesChanged();

    if (this.popupModel) {
      this.popupModel.contentComponentData.model.setItems(this.getVisibleListItems());
    }
  }

  private _popupModel: PopupModel;
  public get popupModel(): PopupModel {
    if (this.renderAs === "select" && !this._popupModel) {
      const listModel = new ListModel(
        this.getVisibleListItems(),
        (item: IAction) => {
          this.value = item.id;
          this.popupModel.toggleVisibility();
        },
        true);
      listModel.denySearch = this.denySearch;

      this._popupModel = new PopupModel("sv-list", {
        model: listModel,
      }, "bottom", "center", false);
      this._popupModel.widthMode = (this.dropdownWidthMode === "editorWidth") ? "fixedWidth" : "contentWidth";
    }
    return this._popupModel;
  }
}
Serializer.addClass(
  "dropdown",
  [
    { name: "optionsCaption", serializationProperty: "locOptionsCaption" },
    { name: "showOptionsCaption:boolean", default: true },
    { name: "choicesMin:number", default: 0 },
    { name: "choicesMax:number", default: 0 },
    { name: "choicesStep:number", default: 1, minValue: 1 },
    {
      name: "autoComplete",
      dataList: [
        "name",
        "honorific-prefix",
        "given-name",
        "additional-name",
        "family-name",
        "honorific-suffix",
        "nickname",
        "organization-title",
        "username",
        "new-password",
        "current-password",
        "organization",
        "street-address",
        "address-line1",
        "address-line2",
        "address-line3",
        "address-level4",
        "address-level3",
        "address-level2",
        "address-level1",
        "country",
        "country-name",
        "postal-code",
        "cc-name",
        "cc-given-name",
        "cc-additional-name",
        "cc-family-name",
        "cc-number",
        "cc-exp",
        "cc-exp-month",
        "cc-exp-year",
        "cc-csc",
        "cc-type",
        "transaction-currency",
        "transaction-amount",
        "language",
        "bday",
        "bday-day",
        "bday-month",
        "bday-year",
        "sex",
        "url",
        "photo",
        "tel",
        "tel-country-code",
        "tel-national",
        "tel-area-code",
        "tel-local",
        "tel-local-prefix",
        "tel-local-suffix",
        "tel-extension",
        "email",
        "impp",
      ],
    },
    { name: "renderAs", default: "default", visible: false },
    { name: "denySearch:boolean", default: false, visible: false },
    { name: "dropdownWidthMode", default: "editorWidth", visible: false },
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
