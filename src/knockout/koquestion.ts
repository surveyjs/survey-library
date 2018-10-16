import * as ko from "knockout";
import { Question } from "../question";
import { SurveyElement } from "../base";
import { Helpers } from "../helpers";
import { ImplementorBase } from "./kobase";

export class QuestionImplementor extends ImplementorBase {
  private koDummy: any;
  koTemplateName: any;
  koElementType: any;
  koValue: any;
  koComment: any;
  constructor(public question: Question) {
    super(question);
    var self = this;
    question.surveyLoadCallback = function() {
      self.onSurveyLoad();
    };
    this.koTemplateName = ko.pureComputed(function() {
      return self.getTemplateName();
    });
    this.koElementType = ko.observable("survey-question");
    (<any>this.question)["koElementType"] = this.koElementType;
    (<any>this.question)["koTemplateName"] = this.koTemplateName;
    (<any>this.question)["updateQuestion"] = function() {
      self.updateQuestion();
    };
    (<any>this.question)["koCss"] = ko.pureComputed(function() {
      return self.question.cssClasses;
    });
    (<any>this.question)["koRootClass"] = ko.pureComputed(function() {
      var result = self.question.cssClasses.mainRoot;
      if (self.question.getTitleLocation() === "left") {
        result += " sv_qstn_left";
      }
      if (self.question.errors.length > 0) {
        result += " " + self.question.cssClasses.hasError;
      }
      return result;
    });

    question.valueChangedCallback = function() {
      self.onValueChanged();
    };
    question.commentChangedCallback = function() {
      self.onCommentChanged();
    };
    question.registerFunctionOnPropertyValueChanged("visibleIndex", function() {
      self.onVisibleIndexChanged();
    });
    this.koDummy = ko.observable(0);
    this.koValue = this.createkoValue();
    this.koComment = ko.observable(this.question.comment);
    this.koValue.subscribe(function(newValue: any) {
      self.updateValue(newValue);
    });
    this.koComment.subscribe(function(newValue: any) {
      self.updateComment(newValue);
    });
    (<any>this.question)["koValue"] = this.koValue;
    (<any>this.question)["koComment"] = this.koComment;
    (<any>this.question)["koQuestionAfterRender"] = function(el: any, con: any) {
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
  protected onSurveyLoad() {}
  protected getQuestionTemplate(): string {
    return this.question.getTemplate();
  }
  private getTemplateName(): string {
    if (
      this.question.customWidget &&
      !this.question.customWidget.widgetJson.isDefaultRender
    )
      return "survey-widget-" + this.question.customWidget.name;
    return "survey-question-" + this.getQuestionTemplate();
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
  protected koQuestionAfterRender(elements: any, con: any) {
    var el = SurveyElement.GetFirstNonTextElement(elements);
    var tEl = elements[0];
    if (tEl.nodeName === "#text") tEl.data = "";
    tEl = elements[elements.length - 1];
    if (tEl.nodeName === "#text") tEl.data = "";
    if (el && this.question.customWidget)
      this.question.customWidget.afterRender(this.question, el);
  }
}
