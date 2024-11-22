import * as ko from "knockout";
import { SurveyModel, PopupSurveyModel, settings, SvgRegistry, addIconsToThemeSet } from "survey-core";
import { ImplementorBase } from "./kobase";
var koTemplate = require("html-loader?interpolate!val-loader!./templates/window.html");

import { icons as iconsV1 } from "@coreIconsV1";
import { icons as iconsV2 } from "@coreIconsV2";

addIconsToThemeSet("v1", iconsV1);
addIconsToThemeSet("v2", iconsV2);

export class PopupSurveyImplementor extends ImplementorBase {
  constructor(public window: PopupSurveyModel) {
    super(window);
    this.window.showingChangedCallback = () => {
      this.doShowingChanged();
    };
    (<any>this.window)["doExpand"] = () => {
      this.window.changeExpandCollapse();
    };
    (<any>this.window)["doHide"] = () => {
      this.window.hide();
    };
    (<any>this.window)["doToggleFullScreen"] = () => {
      this.window.toggleFullScreen();
    };
  }
  private doShowingChanged() {
    const windowElement = this.window.windowElement;
    const { rootElement } = settings.environment;
    if (this.window.isShowing) {
      windowElement.innerHTML = this.template;
      ko.cleanNode(windowElement);
      ko.applyBindings(this.window, windowElement);
      rootElement.appendChild(windowElement);
    } else {
      rootElement.removeChild(windowElement);
      windowElement.innerHTML = "";
    }
  }
  private get template(): string {
    return this.window.templateValue ? this.window.templateValue : koTemplate;
  }
}

PopupSurveyModel.prototype["onCreating"] = function() {
  SvgRegistry.registerIcons(settings.useLegacyIcons ? iconsV1 : iconsV2);
  this.implementor = new PopupSurveyImplementor(this);
};

export class PopupSurvey extends PopupSurveyModel {
  constructor(jsonObj: any, initialModel: SurveyModel = null) {
    super(jsonObj, initialModel);
  }
}

export class SurveyWindow extends PopupSurvey {
}