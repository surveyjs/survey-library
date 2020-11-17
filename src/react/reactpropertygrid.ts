import {PropertyGridModel} from "../propertyGrid";
import {ReactSurveyModel} from "./reactsurveymodel";
import {SurveyModel} from "../survey";

export class PropertyGrid extends PropertyGridModel {
    protected createSurvey(): SurveyModel {
        return new ReactSurveyModel(this.createJSON());
    }
}