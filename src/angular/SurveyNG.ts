import * as ko from "knockout";
import { SurveyModel } from "../survey";
import { Survey } from "../knockout/kosurvey";
import { SurveyWindow } from "../knockout/koSurveyWindow";
import { updateSurveyProps } from "../utils/updateSurveyProps";

export class SurveyNG {
  public static render(elementId: string | Element, props:any) {
    var element: Element =
      typeof elementId === "string"
        ? document.getElementById(elementId)
        : elementId;
    var model = props.model;
    updateSurveyProps(model, props);
    model.render(element);
  }
}

export class SurveyWindowNG {
  public static render(elementId: string | Element, props:any) {
    var model = props.model;
    updateSurveyProps(model, props);
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
