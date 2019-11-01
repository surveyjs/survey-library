import * as ko from "knockout";
import { Question } from "../question";
import { SurveyElement } from "../base";
import { Helpers } from "../helpers";
import { ImplementorBase } from "./kobase";

export class QuestionImplementor extends ImplementorBase {
  private koDummy: any;
  koTemplateName: any;
  koElementType: any;
  private _koValue = ko.observableArray<any>();
  constructor(public question: Question) {
    super(question);
    var isSynchronizing = false;
    this._koValue.subscribe(newValue => {
      if (!isSynchronizing) {
        this.question.value = newValue;
      }
    });
    Object.defineProperty(this.question, "koValue", {
      get: () => {
        if (!Helpers.isTwoValueEquals(this._koValue(), this.getKoValue())) {
          try {
            isSynchronizing = true;
            this._koValue(this.getKoValue());
          } finally {
            isSynchronizing = false;
          }
        }
        return this._koValue;
      },
      enumerable: true,
      configurable: true
    });
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
      var question = self.question;
      var result = question.cssMainRoot;
      if (question.koCss().small && !question.width) {
        result += " " + question.koCss().small;
      }
      return result;
    });
    (<any>this.question)["koHeaderClass"] = ko.pureComputed(function() {
      var question = self.question;
      var cssClasses = self.question.cssClasses;
      var headerClass = cssClasses.header;
      if (question.hasTitleOnTop) {
        headerClass += " " + cssClasses.headerTop;
      }
      if (question.hasTitleOnLeft) {
        headerClass += " " + cssClasses.headerLeft;
      }
      if (question.hasTitleOnBottom) {
        headerClass += " " + cssClasses.headerBottom;
      }
      return headerClass;
    });
    (<any>this.question)["koContentClass"] = ko.pureComputed(function() {
      var question = self.question;
      return (
        question.koCss().content +
        (question.hasTitleOnLeft ? " " + question.koCss().contentLeft : "")
      );
    });
    (<any>this.question)["koTitleClass"] = ko.pureComputed(function() {
      var question = self.question;
      var cssClasses = question.cssClasses;
      var result = cssClasses.title;
      if (question.containsErrors) {
        result += " " + cssClasses.titleOnError;
      } else if (question.isAnswered) {
        result += " " + cssClasses.titleOnAnswer;
      }
      return result;
    });
    (<any>this.question)["koErrorClass"] = ko.pureComputed(function() {
      var question = self.question;
      var classes = question.cssClasses.error.root;
      if (question.errorLocation == "top") {
        classes += " " + question.cssClasses.error.locationTop;
      } else if (question.errorLocation === "bottom") {
        classes += " " + question.cssClasses.error.locationBottom;
      }
      return classes;
    });
    question.registerFunctionOnPropertyValueChanged("visibleIndex", function() {
      self.onVisibleIndexChanged();
    });
    this.koDummy = ko.observable(0);
    (<any>this.question)["koQuestionAfterRender"] = function(
      el: any,
      con: any
    ) {
      self.koQuestionAfterRender(el, con);
    };
  }
  protected getKoValue() {
    return this.question.value;
  }
  protected updateQuestion() {
    this.updateKoDummy();
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
    if (el && this.question.customWidget) {
      this.question.customWidget.afterRender(this.question, el);
      ko.utils.domNodeDisposal.addDisposeCallback(el, () => {
        try {
          this.question.customWidget.willUnmount(this.question, el);
        } catch {
          console.warn("Custom widget will unmount failed");
        }
      });
    }
  }
}
