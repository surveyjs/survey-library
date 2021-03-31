import { Base } from "./base";
import { ItemValue } from "./itemvalue";
import { QuestionSelectBase } from "./question_baseselect";
//model from Question and ItemValue
export class ButtonGroupItemModel {
  constructor(
    public question: QuestionSelectBase,
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
  public get caption() {
    return this.item.locText;
  }
  public get showCaption() {
    return this.item.showCaption;
  }
  public get isRequired() {
    return this.question.isRequired;
  }
  public get selected() {
    return this.question.isItemSelected(this.item);
  }
  public get readOnly() {
    return !this.item.isEnabled || this.question.isReadOnly;
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
    let css = this.question.cssClasses.buttonGroupItem;
    if (this.selected) {
      css += " " + this.question.cssClasses.buttonGroupItemSelected;
    }
    if (this.readOnly) {
      css += " " + this.question.cssClasses.buttonGroupItemDisabled;
    }
    return css;
  }
  public get css() {
    return {
      label: this.labelClass,
      icon: this.question.cssClasses.buttonGroupItemIcon,
      control: this.question.cssClasses.buttonGroupItemControl,
      caption: this.question.cssClasses.buttonGroupItemCaption,
      decorator: this.question.cssClasses.buttonGroupItemDecorator,
    };
  }
  public onChange() {
    this.question.renderedValue = this.item.value;
  }
}
