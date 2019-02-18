import * as ko from "knockout";
import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";
import {
  QuestionSelectBase,
  QuestionCheckboxBase
} from "../question_baseselect";

export class QuestionCheckboxBaseImplementor extends QuestionImplementor {
  constructor(question: Question) {
    super(question);
    (<any>this.question)["koAfterRender"] = this.koAfterRender;
  }
  private koAfterRender(el: any, con: any) {
    var tEl = el[0];
    if (tEl.nodeName == "#text") tEl.data = "";
    tEl = el[el.length - 1];
    if (tEl.nodeName == "#text") tEl.data = "";
  }
}
