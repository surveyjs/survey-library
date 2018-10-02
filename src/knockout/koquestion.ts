import * as ko from "knockout";
import { Question } from "../question";
import { SurveyElement } from "../base";
import { Helpers } from "../helpers";
import { ImplementorBase } from "./kobase";

export class QuestionImplementor extends ImplementorBase {
  private koDummy: any;
  koVisible: any;
  koPaddingLeft: any;
  koPaddingRight: any;
  koRenderWidth: any;
  koTemplateName: any;
  koElementType: any;
  koValue: any;
  koComment: any;
  koIsReadOnly: any;
  constructor(public question: Question) {
    super(question);
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
    question.registerFunctionOnPropertyValueChanged("isReadOnly", function() {
      self.onReadOnlyChanged();
    });
    this.koDummy = ko.observable(0);
    this.koValue = this.createkoValue();
    this.koComment = ko.observable(this.question.comment);
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
    this.onVisibilityChanged();
    this.onReadOnlyChanged();
  }
  protected onVisibilityChanged() {
    this.koVisible(this.question.isVisible);
  }
  protected onReadOnlyChanged() {
    this.koIsReadOnly(this.question.isReadOnly);
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
