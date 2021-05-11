import * as ko from "knockout";
import { QuestionImplementor } from "./koquestion";
import { Question } from "survey-core";
import { QuestionSelectBase } from "survey-core";

export class QuestionSelectBaseImplementor extends QuestionImplementor {
  protected onCreated() {}
  constructor(question: Question) {
    super(question);
    this.onCreated();
  }
  protected get isOtherSelected(): boolean {
    return (<QuestionSelectBase>this.question).isOtherSelected;
  }
}
export class QuestionCheckboxBaseImplementor extends QuestionSelectBaseImplementor {
  constructor(question: Question) {
    super(question);
    this.setCallbackFunc("koAfterRender", this.koAfterRender);
  }
  private koAfterRender(el: any, con: any) {
    var tEl = el[0];
    if (tEl.nodeName == "#text") tEl.data = "";
    tEl = el[el.length - 1];
    if (tEl.nodeName == "#text") tEl.data = "";
  }
}
