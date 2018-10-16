import * as ko from "knockout";
import { QuestionCheckboxBaseImplementor } from "./koquestion_baseselect";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionCheckboxModel } from "../question_checkbox";
import { Question } from "../question";

class QuestionCheckboxImplementor extends QuestionCheckboxBaseImplementor {
  constructor(question: Question) {
    super(question);
  }
  protected createkoValue(): any {
    return this.question.value
      ? ko.observableArray(this.question.value)
      : ko.observableArray();
  }
  protected setkoValue(newValue: any) {
    if (newValue) {
      this.koValue([].concat(newValue));
    } else {
      this.koValue([]);
    }
  }
}
export class QuestionCheckbox extends QuestionCheckboxModel {
  koAllSelected: any;
  private isAllSelectedUpdating = false;
  constructor(public name: string) {
    super(name);
    new QuestionCheckboxImplementor(this);
    this.koAllSelected = ko.observable(this.isAllSelected);
    var self = this;
    this.koAllSelected.subscribe(function(newValue: any) {
      if (self.isAllSelectedUpdating) return;
      if (newValue) self.selectAll();
      else self.clearValue();
    });
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
    var val = (<any>this)["koValue"](); //trigger dependencies from koValue for knockout
    var isChecked = this.isItemSelected(item);
    var itemClass =
      this.cssClasses.item +
      (this.colCount === 0
        ? " sv_q_checkbox_inline"
        : " sv-q-col-" + this.colCount);

    if (isChecked) itemClass += " checked";

    return itemClass;
  }
}

JsonObject.metaData.overrideClassCreatore("checkbox", function() {
  return new QuestionCheckbox("");
});
QuestionFactory.Instance.registerQuestion("checkbox", name => {
  var q = new QuestionCheckbox(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
