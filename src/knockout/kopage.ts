import * as ko from "knockout";
import { PageModel } from "../page";
import { PanelModelBase, PanelModel, QuestionRowModel } from "../panel";
import { JsonObject } from "../jsonobject";
import { QuestionBase } from "../questionbase";
import { SurveyElement, IElement } from "../base";
import { ElementFactory } from "../questionfactory";

export class QuestionRow extends QuestionRowModel {
  koVisible: any;
  koElements: any;
  koGetType: any;
  koElementAfterRender: any;
  constructor(public panel: PanelModelBase) {
    super(panel);
    this.koVisible = ko.observable(this.visible);
    this.koElements = ko.observableArray();
    var self = this;
    this.koGetType = function(el) {
      return self.getElementType(el);
    };
    this.koElementAfterRender = function(el, con) {
      return self.elementAfterRender(el, con);
    };
  }
  public addElement(q: IElement) {
    super.addElement(q);
    this.koElements(this.elements);
  }
  protected onVisibleChanged() {
    this.koVisible(this.visible);
    super.onVisibleChanged();
  }
  public getElementType(el) {
    return el.isPanel ? "survey-panel" : "survey-question";
  }
  public koAfterRender(el, con) {
    for (var i = 0; i < el.length; i++) {
      var tEl = el[i];
      var nName = tEl.nodeName;
      if (nName == "#text") tEl.data = "";
    }
  }
  private elementAfterRender(elements, con) {
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

export class PanelImplementorBase {
  koRows: any;
  constructor(public panel: PanelModelBase) {
    var self = this;
    this.koRows = ko.observableArray();
    this.panel.rowsChangedCallback = function() {
      self.koRows(self.panel.rows);
    };
    this.panel["koRows"] = this.koRows;
  }
}

export class Panel extends PanelModel {
  koVisible: any;
  koInnerMargin: any;
  koRenderWidth: any;
  koElementType: any;
  koErrors: any;
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
    this.koVisible = ko.observable(this.isVisible);
    this.koRenderWidth = ko.observable(this.renderWidth);
    this.koErrors = ko.observable(this.errors);
    this.koCss = ko.pureComputed(function() {
      return self.cssClasses;
    });
    this.koIsCollapsed = ko.observable(this.isCollapsed);
    this.koIsExpanded = ko.observable(this.isExpanded);
    this.stateChangedCallback = function() {
      self.onStateChanged();
    };
    this.errorsChangedCallback = function() {
      self.koErrors(self.errors);
    };
    this.doExpand = function() {
      self.changeExpanded();
    };
    this.registerFunctionOnPropertiesValueChanged(
      ["renderWidth", "innerIndent", "rightIndent"],
      function() {
        self.onRenderWidthChanged();
      }
    );
    this.koInnerMargin = ko.observable(this.getIndentSize(this.innerIndent));
  }
  protected createRow(): QuestionRowModel {
    var result = new QuestionRow(this);
    result.visibilityChangedCallback = this.childVisibilityChangeHandler;
    return result;
  }
  protected onCreating() {}
  protected onNumChanged(value: number) {
    this.locTitle.onChanged();
  }
  protected onRenderWidthChanged() {
    this.koRenderWidth(this.renderWidth);
    this.koInnerMargin(this.getIndentSize(this.innerIndent));
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
    this.koVisible(this.isVisible);
    this.onStateChanged();
  }
  protected onVisibleChanged() {
    super.onVisibleChanged();
    this.koVisible(this.isVisible);
  }
  private getIndentSize(indent: number): string {
    if (indent < 1) return "";
    if (!this.data) return "";
    var css = this.survey["css"];
    if (!css) return "";
    return indent * css.question.indent + "px";
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
