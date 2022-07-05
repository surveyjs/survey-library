import { property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionSelectBase } from "./question_baseselect";
import { surveyLocalization } from "./surveyStrings";
import { LocalizableString } from "./localizablestring";
import { ItemValue } from "./itemvalue";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { PopupModel } from "./popup";
import { ListModel } from "./list";
import { Action, IAction } from "./actions/action";
import { Base, ComputedUpdater, EventBase } from "./base";
import { findParentByClassNames } from "./utils/utils";
import { PopupUtils } from "./utils/popup";
import { settings } from "./settings";

/**
 * A Model for a dropdown question
 */
export class QuestionDropdownModel extends QuestionSelectBase {
  private getVisibleListItems() {
    return this.visibleChoices.map((choice: ItemValue) => new Action({
      id: choice.value,
      title: choice.text,
      component: this.itemComponent,
      visible: <any>new ComputedUpdater<boolean>(() => choice.isVisible),
      enabled: <any>new ComputedUpdater<boolean>(() => choice.isEnabled),
    }));
  }

  constructor(name: string) {
    super(name);
    this.createLocalizableString("placeholder", this, false, true);
    var self = this;
    this.registerFunctionOnPropertiesValueChanged(
      ["choicesMin", "choicesMax", "choicesStep"],
      function () {
        self.onVisibleChoicesChanged();
      }
    );
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
   * The input place holder.
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

  /**
 * Use it to clear the question value.
 */
  @property({ defaultValue: false }) allowClear: boolean;
  @property() itemComponent: string;
  @property({
    defaultValue: false,
    onSet: (newValue: boolean, target: QuestionDropdownModel) => {
      if (!!target.popupModel && target.popupModel.contentComponentData.model instanceof ListModel) {
        const listModel = target.popupModel.contentComponentData.model as ListModel;
        listModel.denySearch = newValue;
      }
    }
  }) denySearch: boolean;

  public getControlClass(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.control)
      .append(this.cssClasses.controlEmpty, this.isEmpty())
      .append(this.cssClasses.onError, this.errors.length > 0)
      .append(this.cssClasses.controlDisabled, this.isReadOnly)
      .toString();
  }
  public get readOnlyText() {
    return this.hasOther && this.isOtherSelected ? this.otherText : (this.displayValue || this.placeholder);
  }

  public onClear(event: any): void {
    this.clearValue();
    event.preventDefault();
    event.stopPropagation();
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

      this._popupModel = new PopupModel("sv-list", { model: listModel, }, "bottom", "center", false);
      this._popupModel.onVisibilityChanged.add((_, option: { isVisible: boolean }) => {
        if (option.isVisible) {
          this.onOpenedCallBack();
        }
      });
    }
    return this._popupModel;
  }
  public onOpened: EventBase<QuestionDropdownModel> = this.addEvent<QuestionDropdownModel>();
  public onOpenedCallBack(): void {
    this.onOpened.fire(this, { question: this, choices: this.choices });
  }
  public onClick(event: any): void {
    if (this.visibleChoices.length === 0) return;

    if (!!event && !!event.target) {
      const target = findParentByClassNames(event.target, this.cssClasses.control.split(" "));
      if (!!target) {
        PopupUtils.updatePopupWidthBeforeShow(this.popupModel, target, event);
      }
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
    {
      name: "autoComplete",
      dataList: settings.questions.dataList,
    },
    { name: "renderAs", default: "default", visible: false },
    { name: "denySearch:boolean", default: false, visible: false },
    { name: "itemComponent", visible: false },
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
