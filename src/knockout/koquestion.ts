import * as ko from "knockout";
import { QuestionImplementorBase } from "./koquestionbase";
import { Question } from "../question";
import { SurveyElement } from "../base";
import { Helpers } from "../helpers";

export class QuestionImplementor extends QuestionImplementorBase {
  private koDummy: any;
  koValue: any;
  koComment: any;
  koIsReadOnly: any;
  constructor(public question: Question) {
    super(question);
    var self = this;
    question.valueChangedCallback = function() {
      self.onValueChanged();
    };
    question.commentChangedCallback = function() {
      self.onCommentChanged();
    };
    question.errorsChangedCallback = function() {
      self.onErrorsChanged();
    };
    question.registerFunctionOnPropertyValueChanged("visibleIndex", function() {
      self.onVisibleIndexChanged();
    });
    question.registerFunctionOnPropertyValueChanged("isReadOnly", function() {
      self.onReadOnlyChanged();
    });
    this.koDummy = ko.observable(0);
    this.koValue = this.createkoValue();
    this.koComment = ko.observable(this.question.comment);
    this.koErrors(this.question.errors);
    this.koIsReadOnly = ko.observable(this.question.isReadOnly);
    this.koValue.subscribe(function(newValue) {
      self.updateValue(newValue);
    });
    this.koComment.subscribe(function(newValue) {
      self.updateComment(newValue);
    });
    this.question["koValue"] = this.koValue;
    this.question["koComment"] = this.koComment;
    this.question["koIsReadOnly"] = this.koIsReadOnly;
    this.question["koQuestionAfterRender"] = function(el, con) {
      self.koQuestionAfterRender(el, con);
    };
  }
  protected updateQuestion() {
    this.updateKoDummy();
  }
  private isValueChangedPerforming = false;
  protected onValueChanged() {
    var val = this.question.value;
    if (Helpers.isTwoValueEquals(val, this.koValue())) return;
    this.isValueChangedPerforming = true;
    this.setkoValue(val);
    this.isValueChangedPerforming = false;
  }
  protected onCommentChanged() {
    var val = this.question.comment;
    if (Helpers.isTwoValueEquals(val, this.koValue())) return;
    this.koComment(val);
  }
  protected onVisibleIndexChanged() {
    this.updateKoDummy();
  }
  protected onSurveyLoad() {
    super.onSurveyLoad();
    this.onReadOnlyChanged();
  }
  protected onReadOnlyChanged() {
    this.koIsReadOnly(this.question.isReadOnly);
  }
  protected onErrorsChanged() {
    this.koErrors(this.question.errors);
  }
  protected createkoValue(): any {
    return ko.observable(this.question.value);
  }
  protected setkoValue(newValue: any) {
    this.koValue(newValue);
  }
  protected updateValue(newValue: any) {
    if (this.isValueChangedPerforming) return;
    if (!Helpers.isTwoValueEquals(this.question.value, newValue)) {
      this.question.value = Helpers.getUnbindValue(newValue);
    }
  }
  protected updateComment(newValue: any) {
    this.question.comment = newValue;
  }
  protected getNo(): string {
    return this.question.visibleIndex > -1
      ? this.question.visibleIndex + 1 + ". "
      : "";
  }
  protected updateKoDummy() {
    this.koDummy(this.koDummy() + 1);
    this.question.locTitle.onChanged();
  }
  protected koQuestionAfterRender(elements, con) {
    var el = SurveyElement.GetFirstNonTextElement(elements);
    var tEl = elements[0];
    if (tEl.nodeName === "#text") tEl.data = "";
    tEl = elements[elements.length - 1];
    if (tEl.nodeName === "#text") tEl.data = "";
    if (el && this.question.customWidget)
      this.question.customWidget.afterRender(this.question, el);
  }
}
