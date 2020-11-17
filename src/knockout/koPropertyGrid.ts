import { PropertyGridModel } from "../propertyGrid";
import { Survey } from "./kosurvey";
import { SurveyModel } from "../survey";
import * as ko from "knockout";
import { Base } from "../base";

export class PropertyGrid extends PropertyGridModel {
  public koSurvey: ko.Observable<SurveyModel> = ko.observable();

  constructor(obj: Base) {
    super(obj);
    this.koSurvey(this.survey);
    this.objValueChangedCallback = () => {
      this.koSurvey(this.survey);
    };
  }

  protected createSurvey(): SurveyModel {
    return new Survey(this.createJSON());
  }
}
