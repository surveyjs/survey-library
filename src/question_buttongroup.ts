import { Serializer, property } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { ItemValue } from "./itemvalue";
import { QuestionCheckboxBase } from "./question_baseselect";
import { LocalizableString } from "./localizablestring";
import { CssClassBuilder } from "./utils/cssClassBuilder";

export class ButtonGroupItemValue extends ItemValue {
  constructor(
    value: any,
    text: string = null,
    protected typeName = "buttongroupitemvalue"
  ) {
    super(value, text, typeName);
  }
  /*
    Item icon property
  */
  @property()
  iconName: string;
  /*
    By default icon size is 24.
    Use this property to change item icon size.
  */
  @property()
  iconSize: number;
  /**
   * By default item caption is visible.
   * Set it 'false' to hide item caption.
   */
  @property()
  showCaption: boolean;
  public getType(): string {
    return !!this.typeName ? this.typeName : "buttongroupitemvalue";
  }
}

/**
 * A Model for a button group question.
 */
export class QuestionButtonGroupModel extends QuestionCheckboxBase {
  constructor(name: string) {
    super(name);
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
  "itemvalue"
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
    this.question.renderedValue = this.item.value;
  }
}
