import * as ko from "knockout";
import { Survey, PopupSurvey } from "./knockout-ui-model";
export { Model } from "./knockout-ui-model";
export * from "./core-wo-model";

// themes settings
export * from "./plugins";

// localization
import "./chunks/localization";

const innerKo: any = ko;
export { innerKo as ko };

import { registerTemplateEngine } from "../knockout/kosurvey";
import { SurveyModel } from "../survey";
import { settings } from "../settings";

export class ReactSurveyModel extends Survey {
  constructor(
    jsonObj: any = null,
    renderedElement: any = null,
    css: any = null
  ) {
    super(jsonObj, renderedElement);
    if(!!css) this.css = css;
    // eslint-disable-next-line no-console
    console.warn("ReactSurveyModel is depricated in this context. Use Survey.Model instead.");
  }
}

export class SurveyNG {
  public static render(elementId: string | Element, props: any): void {
    const { root } = settings.environment;
    const element: Element | null =
      typeof elementId === "string"
        ? root.getElementById(elementId)
        : elementId;
    const model: SurveyModel = props.model;
    model.updateSurvey(props);
    model.render(element);
  }
}

export class PopupSurveyNG {
  public static render(elementId: string | Element, props: any): void {
    var model: SurveyModel = props.model;
    model.updateSurvey(props);
    var survey = new PopupSurvey(null, model);
    if (props.expanded !== undefined) {
      survey.isExpanded = props.expanded;
    }
    if (props.isExpanded !== undefined) {
      survey.isExpanded = props.isExpanded;
    }
    if (props.allowClose !== undefined) {
      survey.allowClose = props.allowClose;
    }
    if (props.closeOnCompleteTimeout !== undefined) {
      survey.closeOnCompleteTimeout = props.closeOnCompleteTimeout;
    }
    if (props.allowFullScreen !== undefined) {
      survey.allowFullScreen = props.allowFullScreen;
    }
    survey.show();
  }
}

export class SurveyWindowNG extends PopupSurveyNG {
}

SurveyModel.platform = "angular";
registerTemplateEngine(ko, SurveyModel.platform);
