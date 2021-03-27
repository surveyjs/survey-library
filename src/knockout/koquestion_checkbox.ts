import * as ko from "knockout";
import { QuestionCheckboxBaseImplementor } from "./koquestion_baseselect";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionCheckboxModel } from "survey-core";
import { Question } from "survey-core";

export class QuestionCheckboxImplementor extends QuestionCheckboxBaseImplementor {
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
  private _implementor: QuestionCheckboxImplementor;
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
    this._implementor = new QuestionCheckboxImplementor(this);
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
  public dispose() {
    this._implementor.dispose();
    this._implementor = undefined;
    this.koAllSelected = undefined;
    super.dispose();
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
