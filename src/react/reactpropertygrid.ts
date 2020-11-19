import { PropertyGridModel } from "../propertyGrid";
import { ReactSurveyModel } from "./reactsurveymodel";
import { SurveyModel } from "../survey";
import { Base } from "../base";

export class PropertyGrid extends PropertyGridModel {
  constructor(obj: Base) {
    super(obj);
  }
  protected createSurvey(json: any): SurveyModel {
    return new ReactSurveyModel(json);
  }
}
