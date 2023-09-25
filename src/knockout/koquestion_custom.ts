import * as ko from "knockout";
import {
  QuestionCustomModel,
  QuestionCompositeModel,
  ComponentQuestionJSON,
  ComponentCollection,
} from "survey-core";
import { QuestionImplementor } from "./koquestion";

export class QuestionCustom extends QuestionCustomModel {
  private _implementor: QuestionImplementor;
  constructor(name: string, questionJSON: ComponentQuestionJSON) {
    super(name, questionJSON);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionImplementor(this);
  }
  public dispose(): void {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
}

export class QuestionComposite extends QuestionCompositeModel {
  private _implementor: QuestionImplementor;
  constructor(name: string, questionJSON: ComponentQuestionJSON) {
    super(name, questionJSON);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionImplementor(this);
  }
  public dispose(): void {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
}

ComponentCollection.Instance.onCreateCustom = function(
  name: string,
  questionJSON: ComponentQuestionJSON
) {
  return new QuestionCustom(name, questionJSON);
};

ComponentCollection.Instance.onCreateComposite = function(
  name: string,
  questionJSON: ComponentQuestionJSON
) {
  return new QuestionComposite(name, questionJSON);
};
