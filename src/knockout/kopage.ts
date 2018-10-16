import * as ko from "knockout";
import { PageModel } from "../page";
import { PanelModelBase, PanelModel, QuestionRowModel } from "../panel";
import { JsonObject } from "../jsonobject";
import { SurveyElement, IElement } from "../base";
import { ElementFactory } from "../questionfactory";
import { ImplementorBase } from "./kobase";

export class QuestionRow extends QuestionRowModel {
  koGetType: any;
  koElementAfterRender: any;
  constructor(public panel: PanelModelBase) {
    super(panel);
    new ImplementorBase(this);
    var self = this;
    this.koGetType = function(el: any) {
      return self.getElementType(el);
    };
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
  private elementAfterRender(elements: any, con: any) {
    if (!this.panel || !this.panel.survey) return;
    var el = SurveyElement.GetFirstNonTextElement(elements);
    if (!el) return;
    var element = <IElement>con;
    if (element.isPanel) {
      this.panel.survey.afterRenderPanel(con, el);
    } else {
      this.panel.survey.afterRenderQuestion(con, el);
    }
  }
}

export class PanelImplementorBase extends ImplementorBase {
  constructor(public panel: PanelModelBase) {
    super(panel);
  }
}

export class Panel extends PanelModel {
  koElementType: any;
  koCss: any;
  koIsExpanded: any;
  koIsCollapsed: any;
  doExpand: any;
  constructor(name: string = "") {
    super(name);
    new PanelImplementorBase(this);
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
    this.doExpand = function() {
      self.changeExpanded();
    };
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
      result += " sv_p_title_expandable";
    }
    return result;
  }
  endLoadingFromJson() {
    super.endLoadingFromJson();
    this.onStateChanged();
  }
}

export class Page extends PageModel {
  constructor(name: string = "") {
    super(name);
    new PanelImplementorBase(this);
    this.onCreating();
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
}

JsonObject.metaData.overrideClassCreatore("panel", function() {
  return new Panel();
});
JsonObject.metaData.overrideClassCreatore("page", function() {
  return new Page();
});

ElementFactory.Instance.registerElement("panel", name => {
  return new Panel(name);
});
