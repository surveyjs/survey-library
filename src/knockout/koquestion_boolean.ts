import * as ko from "knockout";
import { QuestionBooleanModel } from "../question_boolean";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionImplementor } from "./koquestion";

export class QuestionBoolean extends QuestionBooleanModel {
  constructor(public name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImplementor(this);
  }
  public getItemCss(row: any, column: any) {
    let isChecked = this.checkedValue;
    let isDisabled = this.isReadOnly;
    let itemClass = this.cssClasses.item;
    if (isDisabled) itemClass += " " + this.cssClasses.itemDisabled;
    if (isChecked) itemClass += " " + this.cssClasses.itemChecked;
    else if (isChecked === null)
      itemClass += " " + this.cssClasses.itemIndeterminate;
    return itemClass;
  }
  public getCheckedLabelCss(): string {
    return this.getLabelClass(true);
  }
  public getUncheckedLabelCss(): string {
    return this.getLabelClass(false);
  }
  private getLabelClass(checked: boolean): string {
    return (
      this.cssClasses.label +
      (this.checkedValue === !checked || this.isReadOnly
        ? " " + this.cssClasses.disabledLabel
        : "")
    );
  }
  private preventDefaults(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
  private onLabelClick(event: any, value: boolean) {
    if (this.isIndeterminate) {
      this.preventDefaults(event);
      this.checkedValue = value;
    }
    return true;
  }
  public onSwitchClick(data: any, event: any) {
    if (this.isIndeterminate) {
      this.preventDefaults(event);
      var isRightClick = event.offsetX / event.target.offsetWidth > 0.5;
      var isRtl =
        document.defaultView.getComputedStyle(event.target).direction == "rtl";

      this.checkedValue = isRtl ? !isRightClick : isRightClick;
      return;
    }
    return true;
  }
  public onTrueLabelClick(data: any, event: any) {
    return this.onLabelClick(event, true);
  }
  public onFalseLabelClick(data: any, event: any) {
    return this.onLabelClick(event, false);
  }
}
Serializer.overrideClassCreator("boolean", function () {
  return new QuestionBoolean("");
});

QuestionFactory.Instance.registerQuestion("boolean", (name) => {
  return new QuestionBoolean(name);
});
