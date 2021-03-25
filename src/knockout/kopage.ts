import * as ko from "knockout";
import { PageModel } from "survey-core";
import { PanelModelBase, PanelModel, QuestionRowModel } from "survey-core";
import { Serializer } from "survey-core";
import { SurveyElement, IElement } from "survey-core";
import { ElementFactory } from "survey-core";
import { ImplementorBase } from "./kobase";
import { Question } from "survey-core";
import { settings } from "survey-core";
import { Survey } from "./kosurvey";

export class QuestionRow extends QuestionRowModel {
  koElementAfterRender: any;
  constructor(public panel: PanelModelBase) {
    super(panel);
    new ImplementorBase(this);
    var self = this;
    this.koElementAfterRender = function(el: any, con: any) {
      return self.elementAfterRender(el, con);
    };
  }
  public getElementType(el: any) {
    return el.isPanel ? "survey-panel" : "survey-question";
  }
  public koAfterRender(el: any, con: any) {
    for (var i = 0; i < el.length; i++) {
      var tEl = el[i];
      var nName = tEl.nodeName;
      if (nName == "#text") tEl.data = "";
    }
  }

  public getElementWrapperComponentName(el: SurveyElement): string {
    const survey: Survey = el.survey as Survey;
    return survey.getElementWrapperComponentName(el);
  }
  public getElementWrapperComponentData(el: SurveyElement): any {
    const survey: Survey = el.survey as Survey;
    return survey.getElementWrapperComponentData(el);
  }

  private elementAfterRender(elements: any, con: any) {
    if (!this.panel || !this.panel.survey) return;
    var el = SurveyElement.GetFirstNonTextElement(elements);
    if (!el) return;
    var element = <IElement>con;
    if (element.isPanel) {
      this.panel.survey.afterRenderPanel(con, el);
    } else {
      (<Question>element).afterRender(el);
    }
  }

  rowAfterRender(elements: HTMLElement[], model: QuestionRow) {
    if (!model.isNeedRender) {
      var rowContainerDiv = elements[0].parentElement;
      model.startLazyRendering(rowContainerDiv);
      ko.utils.domNodeDisposal.addDisposeCallback(rowContainerDiv, () => {
        model.stopLazyRendering();
        model.isNeedRender = !settings.lazyRowsRendering;
      });
    }
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
  koCss: any;
  koIsExpanded: any;
  koIsCollapsed: any;
  koErrorClass: any;
  toggleStateByKeyUp: any;
  constructor(name: string = "") {
    super(name);
    this.onCreating();
    var self = this;
    this.koElementType = ko.observable("survey-panel");
    this.koCss = ko.pureComputed(function() {
      return self.cssClasses;
    });
    this.koIsCollapsed = ko.observable(this.isCollapsed);
    this.koIsExpanded = ko.observable(this.isExpanded);
    this.stateChangedCallback = function() {
      self.onStateChanged();
    };
    this.toggleStateByKeyUp = function(_: any, event: any) {
      if (event.which === 13) self.toggleState();
    };
    this.koErrorClass = ko.pureComputed(function() {
      var rootClass = self.cssClasses.error.root;
      return rootClass ? rootClass : "panel-error-root";
    });
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new PanelImplementorBase(this);
  }
  protected createRow(): QuestionRowModel {
    return new QuestionRow(this);
  }
  protected onCreating() {}
  protected onNumChanged(value: number) {
    this.locTitle.onChanged();
  }
  private onStateChanged() {
    this.koIsCollapsed(this.isCollapsed);
    this.koIsExpanded(this.isExpanded);
  }
  getTitleStyle() {
    var result = this.cssClasses.panel.title;
    if (this.koIsCollapsed() || this.koIsExpanded()) {
      result += " " + this.cssClasses.panel.titleExpandable;
    }
    if (this.containsErrors) {
      result += " " + this.cssClasses.panel.titleOnError;
    }
    return result;
  }
  endLoadingFromJson() {
    super.endLoadingFromJson();
    this.onStateChanged();
  }
  public dispose() {
    super.dispose();
    this.koCss.dispose();
    this.koErrorClass.dispose();
    this._implementor.dispose();
    this._implementor = undefined;
  }
}

export class Page extends PageModel {
  private _implementor: ImplementorBase;
  constructor(name: string = "") {
    super(name);
    this.onCreating();
  }
  get renderTitleActions() {
    return this.survey.renderTitleActions(this);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new ImplementorBase(this);
  }
  protected createRow(): QuestionRowModel {
    return new QuestionRow(this);
  }
  protected createNewPanel(name: string): PanelModel {
    return new Panel(name);
  }

  protected onCreating() {}
  protected onNumChanged(value: number) {
    this.locTitle.onChanged();
  }
  public dispose() {
    super.dispose();
    this._implementor.dispose();
    this._implementor = undefined;
  }
}

Serializer.overrideClassCreator("panel", function() {
  return new Panel();
});
Serializer.overrideClassCreator("page", function() {
  return new Page();
});

ElementFactory.Instance.registerElement("panel", name => {
  return new Panel(name);
});
