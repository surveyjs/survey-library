import * as ko from "knockout";
import { QuestionBase } from "../questionbase";

export class QuestionImplementorBase {
  koVisible: any;
  koErrors: any;
  koPaddingLeft: any;
  koPaddingRight: any;
  koRenderWidth: any;
  koTemplateName: any;
  koElementType: any;
  constructor(public question: QuestionBase) {
    var self = this;
    question.registerFunctionOnPropertyValueChanged("isVisible", function() {
      self.onVisibilityChanged();
    });
    question.registerFunctionOnPropertiesValueChanged(
      ["renderWidth", "indent", "rightIndent"],
      function() {
        self.onRenderWidthChanged();
      }
    );
    question.surveyLoadCallback = function() {
      self.onSurveyLoad();
    };
    this.koTemplateName = ko.pureComputed(function() {
      return self.getTemplateName();
    });
    this.koElementType = ko.observable("survey-question");
    this.koVisible = ko.observable(this.question.isVisible);
    this.koRenderWidth = ko.observable(this.question.renderWidth);
    this.koErrors = ko.observableArray();
    this.koPaddingLeft = ko.observable(
      self.getIndentSize(self.question.indent)
    );
    this.koPaddingRight = ko.observable(
      self.getIndentSize(self.question.rightIndent)
    );
    this.question["koElementType"] = this.koElementType;
    this.question["koTemplateName"] = this.koTemplateName;
    this.question["koVisible"] = this.koVisible;
    this.question["koRenderWidth"] = this.koRenderWidth;
    this.question["koErrors"] = this.koErrors;
    this.question["koPaddingLeft"] = this.koPaddingLeft;
    this.question["koPaddingRight"] = this.koPaddingRight;
    this.question["updateQuestion"] = function() {
      self.updateQuestion();
    };
    this.question["koCss"] = ko.pureComputed(function() {
      return self.question.cssClasses;
    });
    this.question["koRootClass"] = ko.pureComputed(function() {
      var result = self.question.cssClasses.mainRoot;
      if (self.question.getTitleLocation() === "left") {
        result += " sv_qstn_left";
      }
      if (self.koErrors().length > 0) {
        result += " " + self.question.cssClasses.hasError;
      }
      return result;
    });
  }
  protected updateQuestion() {}
  protected onSurveyLoad() {
    this.onVisibilityChanged();
  }
  protected onVisibilityChanged() {
    this.koVisible(this.question.isVisible);
  }
  protected onRenderWidthChanged() {
    this.koRenderWidth(this.question.renderWidth);
    this.koPaddingLeft(this.getIndentSize(this.question.indent));
    this.koPaddingRight(this.getIndentSize(this.question.rightIndent));
  }
  protected getQuestionTemplate(): string {
    return this.question.getTemplate();
  }
  private getIndentSize(indent: number): string {
    if (indent < 1) return "";
    return indent * this.question.cssClasses.indent + "px";
  }
  private getTemplateName(): string {
    if (
      this.question.customWidget &&
      !this.question.customWidget.widgetJson.isDefaultRender
    )
      return "survey-widget-" + this.question.customWidget.name;
    return "survey-question-" + this.getQuestionTemplate();
  }
}
