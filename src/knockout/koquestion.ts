import * as ko from "knockout";
import { Question } from "survey-core";
import { SurveyElement } from "survey-core";
import { Helpers } from "survey-core";
import { ImplementorBase } from "./kobase";

export class QuestionImplementor extends ImplementorBase {
  private disposedObjects: Array<string>;
  private callBackFunctions: Array<string>;
  private koDummy: any;
  koElementType: any;
  toggleStateByClick: any;
  toggleStateByKeyUp: any;
  private _koValue = ko.observableArray<any>();
  constructor(public question: Question) {
    super(question);
    this.disposedObjects = [];
    this.callBackFunctions = [];
    var isSynchronizing = false;
    this._koValue.subscribe(newValue => {
      if (!isSynchronizing) {
        this.question.value = newValue;
      }
    });

    this.toggleStateByClick = () => {
      this.question.toggleState();
      if (this.question.isExpanded) return true;
      if (this.question.isCollapsed) return false;
    };
    this.toggleStateByKeyUp = (_: any, event: any) => {
      if (event.which !== 13) return;
      this.toggleStateByClick();
    };
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
      configurable: true,
    });
    question.surveyLoadCallback = () => {
      this.onSurveyLoad();
    };
    this.setObservaleObj(
      "koTemplateName",
      ko.pureComputed(() => {
        return this.getTemplateName();
      })
    );
    this.setObservaleObj("koElementType", ko.observable("survey-question"));
    this.setCallbackFunc("updateQuestion", () => {
      this.updateQuestion();
    });
    this.setObservaleObj(
      "koCss",
      ko.pureComputed(() => {
        return this.question.cssClasses;
      })
    );
    this.setObservaleObj(
      "koRootCss",
      ko.pureComputed(() => {
        var cssRoot = this.question.cssRoot;
        if (this.question.isReadOnly)
          cssRoot += " " + this.question.cssClasses.disabled;
        return cssRoot;
      })
    );
    this.setCallbackFunc("toggleStateByClick", this.toggleStateByClick);
    this.setCallbackFunc("toggleStateByKeyUp", this.toggleStateByKeyUp);

    this.setObservaleObj(
      "koErrorClass",
      ko.pureComputed(() => {
        return this.question.cssError;
      })
    );
    question.registerFunctionOnPropertyValueChanged("visibleIndex", () => {
      this.onVisibleIndexChanged();
    });
    this.koDummy = ko.observable(0);
    this.setCallbackFunc("koQuestionAfterRender", (el: any, con: any) => {
      this.koQuestionAfterRender(el, con);
    });
  }
  protected setObservaleObj(
    name: string,
    obj: any,
    addToQuestion: boolean = true
  ) {
    this.disposedObjects.push(name);
    if (addToQuestion) {
      this.question[name] = obj;
    }
    return obj;
  }
  protected setCallbackFunc(name: string, func: any) {
    this.callBackFunctions.push(name);
    this.question[name] = func;
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
    if (this.question.isDisposed) return;
    this.koDummy(this.koDummy() + 1);
    this.question.locTitle.onChanged();
  }
  protected koQuestionAfterRender(elements: any, con: any) {
    !!ko.tasks && ko.tasks.runEarly();
    var el = SurveyElement.GetFirstNonTextElement(elements, true);
    if (!!el) {
      this.question.afterRenderQuestionElement(el);
      if (!!this.question.customWidget) {
        this.question.customWidget.afterRender(this.question, el);
      }
      ko.utils.domNodeDisposal.addDisposeCallback(el, () => {
        this.question.beforeDestroyQuestionElement(el);
        if (!!this.question.customWidget) {
          try {
            this.question.customWidget.willUnmount(this.question, el);
          } catch {
            console.warn("Custom widget will unmount failed");
          }
        }
      });
    }
  }
  public dispose() {
    super.dispose();
    for (var i = 0; i < this.disposedObjects.length; i++) {
      var name = this.disposedObjects[i];
      var obj = (<any>this)[name] || this.question[name];
      if (!obj) continue;
      if ((<any>this)[name]) (<any>this)[name] = undefined;
      if (this.question[name]) this.question[name] = undefined;
      if (obj["dispose"]) obj.dispose();
    }
    this.disposedObjects = [];
    for (var i = 0; i < this.callBackFunctions.length; i++) {
      this.question[this.callBackFunctions[i]] = undefined;
    }
    this.callBackFunctions = [];
    this.question.unRegisterFunctionOnPropertyValueChanged("visibleIndex");
  }
}
