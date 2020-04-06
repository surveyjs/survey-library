import * as ko from "knockout";
import { Question } from "../question";
import {
  QuestionCustomModel,
  QuestionCompositeModel,
  CustomQuestionJSON,
  CustomQuestionCollection,
} from "../question_custom";
import { QuestionImplementor } from "./koquestion";

export class QuestionCustom extends QuestionCustomModel {
  constructor(public name: string, questionJSON: CustomQuestionJSON) {
    super(name, questionJSON);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImplementor(this);
  }
}

export class QuestionComposite extends QuestionCompositeModel {
  constructor(public name: string, questionJSON: CustomQuestionJSON) {
    super(name, questionJSON);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImplementor(this);
  }
}

CustomQuestionCollection.Instance.onCreateCustom = function (
  name: string,
  questionJSON: CustomQuestionJSON
) {
  return new QuestionCustom(name, questionJSON);
};

CustomQuestionCollection.Instance.onCreateComposite = function (
  name: string,
  questionJSON: CustomQuestionJSON
) {
  return new QuestionComposite(name, questionJSON);
};
