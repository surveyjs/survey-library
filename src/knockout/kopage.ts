import * as ko from "knockout";
import { PageModel } from "../page";
import { PanelModelBase, PanelModel, QuestionRowModel } from "../panel";
import { Serializer } from "../jsonobject";
import { SurveyElement, IElement } from "../base";
import { ElementFactory } from "../questionfactory";
import { ImplementorBase } from "./kobase";
import { Question } from "../question";

export class QuestionRow extends QuestionRowModel {
  koGetType: any;
  koElementAfterRender: any;
  constructor(public panel: PanelModelBase) {
    super(panel);
    new ImplementorBase(this);
    var self = this;
    this.koGetType = function (el: any) {
      return self.getElementType(el);
    };
    this.koElementAfterRender = function (el: any, con: any) {
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
  doExpand: any;
  constructor(name: string = "") {
    super(name);
    this.onCreating();
    var self = this;
    this.koElementType = ko.observable("survey-panel");
    this.koCss = ko.pureComputed(function () {
      return self.cssClasses;
    });
    this.koIsCollapsed = ko.observable(this.isCollapsed);
    this.koIsExpanded = ko.observable(this.isExpanded);
    this.stateChangedCallback = function () {
      self.onStateChanged();
    };
    this.doExpand = function () {
      self.changeExpanded();
    };
    this.koErrorClass = ko.pureComputed(function () {
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
  private changeExpanded() {
    if (!this.isCollapsed && !this.isExpanded) return;
    if (this.isCollapsed) {
      this.expand();
    } else {
      this.collapse();
    }
  }
  getTitleStyle() {
    var result = this.cssClasses.panel.title;
    if (this.koIsCollapsed() || this.koIsExpanded()) {
      result += " " + this.cssClasses.panel.titleExpandable;
    }
    return result;
  }
  endLoadingFromJson() {
    super.endLoadingFromJson();
    this.onStateChanged();
  }
  public dispose() {
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
