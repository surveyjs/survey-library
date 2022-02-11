import * as ko from "knockout";
import { SurveyWindowModel } from "survey-core";
import { ImplementorBase } from "./kobase";
var koTemplate = require("html-loader?interpolate!val-loader!./templates/window/window.html");

export class SurveyWindowImplementor extends ImplementorBase {
  constructor(public window: SurveyWindowModel) {
    super(window);
    this.window.showingChangedCallback = () => {
      this.doShowingChanged();
    };
    (<any>this.window)["doExpand"] = () => {
      this.window.changeExpandCollapse();
    };
  }
  private doShowingChanged() {
    const windowElement = this.window.windowElement;
    if (this.window.isShowing) {
      windowElement.innerHTML = this.template;
      ko.cleanNode(windowElement);
      ko.applyBindings(this, windowElement);
      document.body.appendChild(windowElement);
      this.window.survey.render(SurveyWindowModel.surveyElementName);
    } else {
      document.body.removeChild(windowElement);
      windowElement.innerHTML = "";
    }
  }
  private get template(): string {
    return this.window.templateValue ? this.window.templateValue : koTemplate;
  }
}

SurveyWindowModel.prototype["onCreating"] = function() {
  this.implementor = new SurveyWindowImplementor(this);
};

export class SurveyWindow extends SurveyWindowModel {}
