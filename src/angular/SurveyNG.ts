import * as ko from "knockout";
import { SurveyModel } from "../survey";
import { Survey } from "../knockout/kosurvey";
import { SurveyWindow } from "../knockout/koSurveyWindow";

export class SurveyNG {
  public static render(elementId: string | Element, props) {
    var element: Element =
      typeof elementId === "string"
        ? document.getElementById(elementId)
        : elementId;
    props.model.render(element);
  }
}

export class SurveyWindowNG {
  public static render(elementId: string | Element, props) {
    var element: Element =
      typeof elementId === "string"
        ? document.getElementById(elementId)
        : elementId;
    var survey = new SurveyWindow(...props);
    survey.show();
  }
}

SurveyModel.platform = "angular";
