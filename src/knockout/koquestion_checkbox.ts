import * as ko from "knockout";
import { QuestionCheckboxBaseImplementor } from "./koquestion_baseselect";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionCheckboxModel } from "../question_checkbox";
import { Question } from "../question";

class QuestionCheckboxImplementor extends QuestionCheckboxBaseImplementor {
  constructor(question: Question) {
    super(question);
  }
  protected getKoValue() {
    return this.question.renderedValue;
  }
}

export class QuestionCheckbox extends QuestionCheckboxModel {
  koAllSelected: any;
  private isAllSelectedUpdating = false;
  constructor(public name: string) {
    super(name);
    this.koAllSelected = ko.observable(this.isAllSelected);
    var self = this;
    this.koAllSelected.subscribe(function(newValue: any) {
      if (self.isAllSelectedUpdating) return;
      if (newValue) self.selectAll();
      else self.clearValue();
    });
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionCheckboxImplementor(this);
  }
  protected onValueChanged() {
    super.onValueChanged();
    this.updateAllSelected();
  }
  protected onVisibleChoicesChanged() {
    super.onVisibleChoicesChanged();
    this.updateAllSelected();
  }
  protected updateAllSelected() {
    this.isAllSelectedUpdating = true;
    this.koAllSelected(this.isAllSelected);
    this.isAllSelectedUpdating = false;
  }
  getItemClass(item: any) {
    var val = this.value; //trigger dependencies from koValue for knockout
    var isChecked = this.isItemSelected(item);
    var isDisabled = this.isReadOnly || !item.isEnabled;
    var allowHover = !isChecked && !isDisabled;
    var itemClass = this.cssClasses.item;
    if (!this.hasColumns) {
      itemClass +=
        this.colCount === 0
          ? " " + this.cssClasses.itemInline
          : " sv-q-col-" + this.colCount;
    }
    if (isDisabled) itemClass += " " + this.cssClasses.itemDisabled;
    if (isChecked) itemClass += " " + this.cssClasses.itemChecked;
    if (allowHover) itemClass += " " + this.cssClasses.itemHover;
    return itemClass;
  }
  getLabelClass(item: any) {
    return super.getLabelClass(this.isItemSelected(item));
  }
  getItemIndex(item: any) {
    return this.visibleChoices.indexOf(item);
  }
}

Serializer.overrideClassCreator("checkbox", function() {
  return new QuestionCheckbox("");
});
QuestionFactory.Instance.registerQuestion("checkbox", name => {
  var q = new QuestionCheckbox(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
