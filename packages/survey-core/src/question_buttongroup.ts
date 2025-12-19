import { Serializer, property } from "./jsonobject";
import { ItemValue } from "./itemvalue";
import { ChoiceItem, QuestionCheckboxBase } from "./question_baseselect";
import { LocalizableString } from "./localizablestring";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { DropdownListModel } from "./dropdownListModel";
import { updateListCssValues } from "./utils/utils";

export class ButtonGroupItemValue extends ChoiceItem {
  protected getBaseType(): string {
    return "buttongroupitemvalue";
  }
  /*
    Item icon property
  */
  @property() iconName: string;
  /*
    By default icon size is 24.
    Use this property to change item icon size.
  */
  @property() iconSize: number;
  /**
   * By default item caption is visible.
   * Set it 'false' to hide item caption.
   */
  @property() showCaption: boolean;
}

/**
 * A Model for a button group question.
 */
export class QuestionButtonGroupModel extends QuestionCheckboxBase {
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    const resetReadOnlyTextProps = ["value", "renderAs", "placeholder", "choices", "visibleChoices"];
    if (resetReadOnlyTextProps.indexOf(name) > -1) {
      this.resetReadOnlyText();
    }
  }
  public locStrsChanged(): void {
    super.locStrsChanged();
    this.resetReadOnlyText();
    this.dropdownListModelValue?.locStrsChanged();
  }
  public getType(): string {
    return "buttongroup";
  }
  protected getItemValueType() {
    return "buttongroupitemvalue";
  }
  public supportOther(): boolean {
    return false;
  }

  //methods for mobile view
  public getControlClass(): string {
    this.isEmpty();
    return new CssClassBuilder()
      .append(this.cssClasses.control)
      .append(this.cssClasses.controlEmpty, this.isEmpty())
      .append(this.cssClasses.onError, this.hasCssError())
      .append(this.cssClasses.controlDisabled, this.isDisabledStyle)
      .append(this.cssClasses.controlReadOnly, this.isReadOnlyStyle)
      .append(this.cssClasses.controlPreview, this.isPreviewStyle)
      .toString();
  }
  protected getFirstInputElementId(): string {
    return this.inputId + "_0";
  }
  public getInputId(index: number): string {
    return this.inputId + "_" + index;
  }
  public get placeholder(): string {
    return this.getLocStringText(this.locPlaceholder);
  }
  public set placeholder(val: string) {
    this.setLocStringText(this.locPlaceholder, val);
  }
  get locPlaceholder(): LocalizableString {
    return this.getOrCreateLocStr("placeholder", false, "buttongroupOptionsCaption");
  }
  _allowClear = true;
  get allowClear(): boolean {
    return this._allowClear;
  }
  set allowClear(newVal) {
    this._allowClear = newVal;
  }
  get searchEnabled(): boolean {
    return false;
  }
  public isItemSelected(item: ItemValue): boolean {
    return item.value == this.value;
  }
  public get readOnlyText(): string {
    return this.locReadOnlyText.calculatedText;
  }
  public get locReadOnlyText(): LocalizableString {
    return this.getOrCreateLocStr("readOnlyText", true, false, (locStr: LocalizableString) => {
      locStr.onGetTextCallback = (): string => {
        return this.displayValue || this.placeholder;
      };
    });
  }
  private resetReadOnlyText(): void {
    this.resetPropertyValue("readOnlyText");
  }
  @property({ defaultValue: false }) inputHasValue: boolean;

  public get showSelectedItemLocText(): boolean {
    return !this.readOnly && !this.inputHasValue && !!this.selectedItemLocText;
  }
  public get selectedItemLocText(): LocalizableString {
    return this.selectedItem?.locText;
  }

  private dropdownListModelValue: DropdownListModel;
  public set dropdownListModel(val: DropdownListModel) {
    this.dropdownListModelValue = val;
    this.updateElementCss();
  }
  public get dropdownListModel(): DropdownListModel {
    if (this.renderAs === "dropdown") {
      this.onBeforeSetCompactRenderer();
    }
    return this.dropdownListModelValue;
  }
  public get selectedItem(): ItemValue { return this.getSingleSelectedItem(); }

  protected onBlurCore(event: any): void {
    this.dropdownListModel?.onBlur(event);
    super.onBlurCore(event);
  }
  protected updateCssClasses(res: any, css: any) {
    super.updateCssClasses(res, css);
    updateListCssValues(res, css);
  }
  protected calcCssClasses(css: any): any {
    const classes = super.calcCssClasses(css);
    if (this.dropdownListModelValue) {
      this.dropdownListModelValue.updateCssClasses(classes.popup, classes.list);
    }
    return classes;
  }

  // responsiveness
  public needResponsiveWidth(): boolean {
    return true;
  }
  protected supportResponsiveness(): boolean {
    return true;
  }
  protected getCompactRenderAs(): string {
    return "dropdown";
  }
  protected getObservedElementSelector(): string {
    return ".sd-button-group-scrollable-container";
  }
  protected onBeforeSetCompactRenderer(): void {
    if (!this.isDisposed && !this.dropdownListModelValue) {
      this.dropdownListModelValue = new DropdownListModel(this);
    }
  }
  public dispose(): void {
    super.dispose();
    if (!!this.dropdownListModelValue) {
      this.dropdownListModelValue.dispose();
      this.dropdownListModelValue = undefined;
    }
  }
}

Serializer.addClass(
  "buttongroup",
  [
    {
      name: "choices:buttongroupitemvalue[]",
    },
  ],
  function() {
    return new QuestionButtonGroupModel("");
  },
  "checkboxbase"
);

Serializer.addClass(
  "buttongroupitemvalue",
  [
    { name: "showCaption:boolean", default: true },
    { name: "iconName:text" },
    { name: "iconSize:number" },
  ],
  (value: any) => new ButtonGroupItemValue(value),
  "choiceitem"
);

// QuestionFactory.Instance.registerQuestion("buttongroup", name => {
//   var q = new QuestionButtonGroupModel(name);
//   q.choices = QuestionFactory.DefaultChoices;
//   return q;
// });

export class ButtonGroupItemModel {
  constructor(
    public question: QuestionButtonGroupModel,
    public item: ItemValue,
    public index: number
  ) {}
  public get value() {
    return this.item.value;
  }
  public get iconName() {
    return this.item.iconName;
  }
  public get iconSize() {
    return this.item.iconSize || 24;
  }
  public get caption(): LocalizableString {
    return this.item.locText;
  }
  public get showCaption() {
    return this.item.showCaption || this.item.showCaption === undefined;
  }
  public get isRequired() {
    return this.question.isRequired;
  }
  public get selected() {
    return this.question.isItemSelected(this.item);
  }
  public get readOnly() {
    return this.question.isInputReadOnly || !this.item.isEnabled;
  }
  public get name() {
    return this.question.name + "_" + this.question.id;
  }
  public get id() {
    return this.question.inputId + "_" + this.index;
  }
  public get hasErrors() {
    return this.question.errors.length > 0;
  }
  public get describedBy() {
    return this.question.errors.length > 0
      ? this.question.id + "_errors"
      : null;
  }
  private get labelClass() {
    return new CssClassBuilder()
      .append(this.question.cssClasses.item)
      .append(this.question.cssClasses.itemSelected, this.selected)
      .append(this.question.cssClasses.itemHover, !this.readOnly && !this.selected)
      .append(this.question.cssClasses.itemDisabled, this.question.isReadOnly || !this.item.isEnabled)
      .toString();
  }
  public get css() {
    return {
      label: this.labelClass,
      icon: this.question.cssClasses.itemIcon,
      control: this.question.cssClasses.itemControl,
      caption: this.question.cssClasses.itemCaption,
      decorator: this.question.cssClasses.itemDecorator,
    };
  }
  public onChange() {
    this.question.selectItem(this.item);
  }
}
