import * as ko from "knockout";
import { SurveyElement, Question, Helpers, doKey2ClickUp } from "survey-core";
import { ImplementorBase } from "./kobase";

export class QuestionImplementor extends ImplementorBase {
  private disposedObjects: Array<string>;
  private callBackFunctions: Array<string>;
  private koDummy: any;
  koElementType: any;
  private _koValue = ko.observableArray<any>();
  constructor(public question: Question) {
    super(question);
    this.disposedObjects = [];
    this.callBackFunctions = [];
    var isSynchronizing = false;
    this._koValue.subscribe((newValue) => {
      if (!isSynchronizing) {
        this.setKoValue(newValue);
      }
    });

    Object.defineProperty(this.question, "koValue", {
      get: () => {
        if (!Helpers.isTwoValueEquals(this._koValue(), this.getKoValue(), false, true, false)) {
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
    this.koDummy = ko.observable(0);
    this.setCallbackFunc("koQuestionAfterRender", (el: any, con: any) => {
      this.koQuestionAfterRender(el, con);
    });
    this.setCallbackFunc("koMouseDown", () => {
      this.question.onMouseDown();
      return true;
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
  protected setKoValue(val: any) {
    this.question.value = val;
  }
  protected onSurveyLoad() {}
  protected getQuestionTemplate(): string {
    return this.question.getTemplate();
  }
  private getTemplateName(): string {
    if (!!this.question &&
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
    this.question.locTitle.strChanged();
  }
  protected koQuestionAfterRender(elements: any, con: any) {
    setTimeout(() => {
      !!ko.tasks && ko.tasks.runEarly();
      var el = SurveyElement.GetFirstNonTextElement(elements, true);
      if (!!el) {
        this.question.afterRenderQuestionElement(el);
        if (!!this.question && !!this.question.customWidget) {
          this.question.customWidget.afterRender(this.question, el);
        }
        ko.utils.domNodeDisposal.addDisposeCallback(el, () => {
          this.question.beforeDestroyQuestionElement(el);
          if (!!this.question && !!this.question.customWidget) {
            try {
              this.question.customWidget.willUnmount(this.question, el);
            } catch {
              // eslint-disable-next-line no-console
              console.warn("Custom widget will unmount failed");
            }
          }
        });
      }
    }, 0);
  }
  public dispose(): void {
    super.dispose();
    for (let i = 0; i < this.disposedObjects.length; i++) {
      const name = this.disposedObjects[i];
      const obj = (<any>this)[name] || this.question[name];
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
    this.question.unregisterPropertyChangedHandlers(["visibleIndex"]);
  }
}
