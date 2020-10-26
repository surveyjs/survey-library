import {PropertyGridModel} from "../propertyGrid";
import {Survey} from "./kosurvey";
import {SurveyModel} from "../survey";

export class PropertyGrid extends PropertyGridModel {
    protected createSurvey(): SurveyModel {
        return new Survey(this.createJSON());
    }
}