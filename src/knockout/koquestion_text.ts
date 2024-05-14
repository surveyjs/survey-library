import * as ko from "knockout";
import { QuestionTextModel } from "survey-core";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import { Question } from "survey-core";

export class QuestionTextImplementor extends QuestionImplementor {
  constructor(question: QuestionTextModel) {
    super(question);
    this.setCallbackFunc("koOnFocus", (_: any, event: any) => {
      this.question.onFocus(event);
      return true;
    });
    this.setCallbackFunc("koOnBlur", (_: any, event: any) => {
      this.question.onBlur(event);
      return true;
    });
    this.setCallbackFunc("koOnKeyDown", (_: any, event: any) => {
      this.question.onKeyDown(event);
      return true;
    });
    this.setCallbackFunc("koOnKeyUp", (_: any, event: any) => {
      this.question.onKeyUp(event);
      return true;
    });
    this.setCallbackFunc("koOnChange", (_: any, event: any) => {
      this.question.onChange(event);
      return true;
    });
    this.setCallbackFunc("koOnCompositeUpdate", (_: any, event: any) => {
      this.question.onCompositionUpdate(event);
      return true;
    });
    this.setObservaleObj("koReadOnlyValue", ko.computed(() => this.question.inputValue));
  }
}
export class QuestionText extends QuestionTextModel {
  private _implementor: QuestionTextImplementor;
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionTextImplementor(this);
  }
  public dispose(): void {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
}

Serializer.overrideClassCreator("text", function() {
  return new QuestionText("");
});

QuestionFactory.Instance.registerQuestion("text", name => {
  return new QuestionText(name);
});
