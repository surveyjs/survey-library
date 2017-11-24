import * as ko from "knockout";
import { QuestionEmptyModel } from "../question_empty";
import { JsonObject } from "../jsonobject";
import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";

export class QuestionEmpty extends QuestionEmptyModel {
  constructor(public name: string) {
    super(name);
    new QuestionImplementor(this);
  }
}

JsonObject.metaData.overrideClassCreatore("empty", function() {
  return new QuestionEmpty("");
});
