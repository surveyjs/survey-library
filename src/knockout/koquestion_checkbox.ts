import * as ko from "knockout";
import { QuestionCheckboxBaseImplementor } from "./koquestion_baseselect";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionCheckboxModel } from "survey-core";
import { Question } from "survey-core";
import { ImplementorBase } from "./kobase";

export class QuestionCheckboxImplementor extends QuestionCheckboxBaseImplementor {
  constructor(question: Question) {
    super(question);
  }
  protected getKoValue() {
    return this.question.renderedValue;
  }
  protected setKoValue(val: any) {
    this.question.renderedValue = val;
  }
}

export class QuestionCheckbox extends QuestionCheckboxModel {
  koAllSelected: any;
  private isAllSelectedUpdating = false;
  private _implementor: QuestionCheckboxImplementor;
  private _selectAllItemImpl: ImplementorBase = undefined;
  private _otherItemImpl: ImplementorBase = undefined;
  constructor(name: string) {
    super(name);
    this.koAllSelected = ko.observable(this.isAllSelected);
    this.koAllSelected.subscribe((newValue: any) => {
      if (this.isAllSelectedUpdating) return;
      if (newValue) this.selectAll();
      else this.clearValue();
    });
    this._selectAllItemImpl = new ImplementorBase(this.selectAllItem);
    this._otherItemImpl = new ImplementorBase(this.otherItem);
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
    if(this._selectAllItemImpl) {
      this._selectAllItemImpl.dispose();
      this._selectAllItemImpl = undefined;
    }
    if(this._otherItemImpl) {
      this._otherItemImpl.dispose();
      this._otherItemImpl = undefined;
    }
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
