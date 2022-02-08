import { SurveyModel } from "survey-core";
import { SurveyWindowModel } from "survey-core";

export class VueSurveyModel extends SurveyModel {}
export class VueSurveyWindowModel extends SurveyWindowModel {}

SurveyModel.platform = "vue";
