import * as ko from "knockout";

// model
export * from "./chunks/model";

// localization
import "./chunks/localization";

// helpers
export * from "./chunks/helpers";

// css standard
export { defaultStandardCss } from "../defaultCss/cssstandard";
// css bootstrap
export { defaultBootstrapCss } from "../defaultCss/cssbootstrap";
// css bootstrap + material
export { defaultBootstrapMaterialCss } from "../defaultCss/cssbootstrapmaterial";
export { modernCss } from "../defaultCss/cssmodern";

import { Survey, SurveyWindow } from "./knockout";
export { Survey as Model };

import { registerTemplateEngine } from "../knockout/kosurvey";
import { SurveyModel } from "../survey";

export class ReactSurveyModel extends Survey {
  constructor(
    jsonObj: any = null,
    renderedElement: any = null,
    css: any = null
  ) {
    super(jsonObj, renderedElement, css);
    console.warn(
      "ReactSurveyModel is depricated in this context. Use Survey.Model instead."
    );
  }
}

export class SurveyNG {
  public static render(elementId: string | Element, props: any) {
    var element: Element =
      typeof elementId === "string"
        ? document.getElementById(elementId)
        : elementId;
    var model: Survey = props.model;
    model.updateSurvey(props);
    model.render(element);
  }
}

export class SurveyWindowNG {
  public static render(elementId: string | Element, props: any) {
    var model: Survey = props.model;
    model.updateSurvey(props);
    var survey = new SurveyWindow(null, model);
    if (props.expanded !== undefined) {
      survey.isExpanded = props.expanded;
    }
    if (props.isExpanded !== undefined) {
      survey.isExpanded = props.isExpanded;
    }
    survey.show();
  }
}

SurveyModel.platform = "angular";
registerTemplateEngine(ko, SurveyModel.platform);
