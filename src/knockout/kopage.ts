import * as ko from "knockout";
import { PageModel } from "survey-core";
import { PanelModelBase, PanelModel, QuestionRowModel, Question, Base, doKey2ClickUp } from "survey-core";
import { Serializer } from "survey-core";
import { SurveyElement, IElement } from "survey-core";
import { ElementFactory } from "survey-core";
import { ImplementorBase } from "./kobase";
import { } from "survey-core";

export class QuestionRow extends QuestionRowModel {
  koElementAfterRender: any;
  constructor(public panel: PanelModelBase) {
    super(panel);
    new ImplementorBase(this);
    var self = this;
    this.koElementAfterRender = function (el: any, con: any) {
      return self.elementAfterRender(el, con);
    };
  }
  public getElementType(el: any) {
    return el.isPanel ? "survey-panel" : "survey-question";
  }

  public koAfterRender(htmlElements: any, element: SurveyElement) {
    for (var i = 0; i < htmlElements.length; i++) {
      var tEl = htmlElements[i];
      var nName = tEl.nodeName;
      if (nName == "#text") tEl.data = "";
      else {
        element.setWrapperElement(tEl);
        ko.utils.domNodeDisposal.addDisposeCallback(tEl, () => {
          element.setWrapperElement(undefined);
        });
      }
    }
  }
  private elementAfterRender(elements: any, con: any) {
    if (!this.panel || !this.panel.survey) return;

    setTimeout(() => {
      !!ko.tasks && ko.tasks.runEarly();
      var el = SurveyElement.GetFirstNonTextElement(elements);
      if (!el) return;
      var element = <IElement>con;
      if((<Base><any>element).isDisposed) return;
      if (element.isPanel && this.panel.survey) {
        this.panel.survey.afterRenderPanel(con, el);
      } else {
        (<Question>element).afterRender(el);
      }
    }, 0);
  }
  rowAfterRender(elements: HTMLElement[], model: QuestionRow) {
    const rowContainerDiv = elements[0].parentElement;
    model.setRootElement(rowContainerDiv);
    ko.utils.domNodeDisposal.addDisposeCallback(rowContainerDiv, () => {
      model.setRootElement(undefined);
    });
    if (!model.isNeedRender) {
      const timer = setTimeout(() => model.startLazyRendering(rowContainerDiv), 1);
      ko.utils.domNodeDisposal.addDisposeCallback(rowContainerDiv, () => {
        clearTimeout(timer);
        model.stopLazyRendering();
        if(!model.isDisposed) {
          model.isNeedRender = !model.isLazyRendering();
        }
      });
    }
  }
  public dispose(): void {
    super.dispose();
    this.koElementAfterRender = undefined;
  }
}

export class PanelImplementorBase extends ImplementorBase {
  constructor(public panel: PanelModelBase) {
    super(panel);
  }
}

export class Panel extends PanelModel {
  private _implementor: ImplementorBase;
  koElementType: any;
  constructor(name: string = "") {
    super(name);
    this.onCreating();
    var self = this;
    this.koElementType = ko.observable("survey-panel");
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new PanelImplementorBase(this);
  }
  public createRow(): QuestionRowModel {
    return new QuestionRow(this);
  }
  protected onCreating() { }
  protected onNumChanged(value: number) {
    this.locTitle.strChanged();
  }
  public dispose(): void {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
}

export class Page extends PageModel {
  private _implementor: ImplementorBase;
  constructor(name: string = "") {
    super(name);
    this.onCreating();
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new ImplementorBase(this);
  }
  public createRow(): QuestionRowModel {
    return new QuestionRow(this);
  }
  protected onCreating() { }
  protected onNumChanged(value: number) {
    this.locTitle.strChanged();
  }
  public dispose(): void {
    super.dispose();
    this._implementor.dispose();
    this._implementor = undefined;
  }
}

Serializer.overrideClassCreator("panel", function () {
  return new Panel();
});
Serializer.overrideClassCreator("page", function () {
  return new Page();
});

ElementFactory.Instance.registerElement("panel", (name) => {
  return new Panel(name);
});
