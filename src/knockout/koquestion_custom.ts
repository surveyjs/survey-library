import * as ko from "knockout";
import { Question } from "../question";
import {
  QuestionCustomModel,
  QuestionCompositeModel,
  ComponentQuestionJSON,
  ComponentCollection,
} from "../question_custom";
import { QuestionImplementor } from "./koquestion";

export class QuestionCustom extends QuestionCustomModel {
  constructor(public name: string, questionJSON: ComponentQuestionJSON) {
    super(name, questionJSON);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImplementor(this);
  }
}

export class QuestionComposite extends QuestionCompositeModel {
  constructor(public name: string, questionJSON: ComponentQuestionJSON) {
    super(name, questionJSON);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImplementor(this);
  }
}

ComponentCollection.Instance.onCreateCustom = function (
  name: string,
  questionJSON: ComponentQuestionJSON
) {
  return new QuestionCustom(name, questionJSON);
};

ComponentCollection.Instance.onCreateComposite = function (
  name: string,
  questionJSON: ComponentQuestionJSON
) {
  return new QuestionComposite(name, questionJSON);
};
