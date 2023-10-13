import * as ko from "knockout";
import { QuestionTagboxModel } from "survey-core";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionCheckboxBaseImplementor } from "./koquestion_baseselect";

/*
export class QuestionCheckboxImplementor extends QuestionCheckboxBaseImplementor {
  constructor(question: Question) {
    super(question);
  }
  protected getKoValue() {
    return this.question.renderedValue;
  }
}
 */
export class QuestionTagbox extends QuestionTagboxModel {
  koAllSelected: any;
  private isAllSelectedUpdating = false;
  private _implementor: QuestionCheckboxBaseImplementor;
  constructor(name: string) {
    super(name);
    this.koAllSelected = ko.observable(this.isAllSelected);
    this.koAllSelected.subscribe((newValue: any) => {
      if (this.isAllSelectedUpdating) return;
      if (newValue) this.selectAll();
      else this.clearValue();
    });
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionCheckboxBaseImplementor(this);
  }
  public onSurveyValueChanged(newValue: any) {
    super.onSurveyValueChanged(newValue);
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
  public dispose(): void {
    this._implementor.dispose();
    this._implementor = undefined;
    this.koAllSelected = undefined;
    super.dispose();
  }
}
Serializer.overrideClassCreator("tagbox", function() {
  return new QuestionTagbox("");
});
QuestionFactory.Instance.registerQuestion("tagbox", name => {
  const q = new QuestionTagbox(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
