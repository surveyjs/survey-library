import * as ko from "knockout";
import { SurveyWindowModel } from "../surveyWindow";
import { SurveyModel } from "../survey";
import { Survey } from "./kosurvey";
var koTemplate = require("html-loader?interpolate!val-loader!./templates/window/window.html");

export class SurveyWindow extends SurveyWindowModel {
  koExpanded: any;
  koExpandedCss: any;
  doExpand: any;
  constructor(jsonObj: any = null, initialModel: SurveyModel = null) {
    super(jsonObj, initialModel);
    this.koExpanded = ko.observable(false);
    this.koExpandedCss = ko.observable(this.getButtonCss());
    var self = this;
    this.expandedChangedCallback = function() {
      self.koExpanded(self.isExpanded);
      self.koExpandedCss(self.getButtonCss());
    };
    this.showingChangedCallback = function() {
      self.doShowingChanged();
    };
    this.doExpand = function() {
      self.changeExpanded();
    };
  }
  protected createSurvey(jsonObj: any): SurveyModel {
    return new Survey(jsonObj);
  }
  protected closeWindowOnComplete() {
    this.hide();
  }
  protected get template(): string {
    return this.templateValue ? this.templateValue : this.getDefaultTemplate();
  }
  protected set template(value: string) {
    this.templateValue = value;
  }
  protected doShowingChanged() {
    if (this.isShowing) {
      this.windowElement.innerHTML = this.template;
      ko.cleanNode(this.windowElement);
      ko.applyBindings(this, this.windowElement);
      document.body.appendChild(this.windowElement);
      (<Survey>this.survey).render(SurveyWindow.surveyElementName);
    } else {
      document.body.removeChild(this.windowElement);
      this.windowElement.innerHTML = "";
    }
  }
  protected getDefaultTemplate(): string {
    return koTemplate;
  }
  public get css(): any {
    return (<any>this).survey["css"];
  }
  private changeExpanded() {
    this.expandcollapse(!this.isExpanded);
  }
  private getButtonCss() {
    return this.koExpanded()
      ? this.css.window.header.buttonCollapsed
      : this.css.window.header.buttonExpanded;
  }
}
