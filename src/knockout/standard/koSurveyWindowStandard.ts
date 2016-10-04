/// <reference path="../kosurveywindow.ts" />
import Survey from './koSurveyStandard';
import SurveyWindowBase from "../koSurveyWindow";
import SurveyModel from "../../survey";

export class SurveyWindow extends SurveyWindowBase {
    koExpanded: any;
    doExpand: any;
    constructor(jsonObj: any) {
        super(jsonObj);
    }
    protected createSurvey(jsonObj: any): SurveyModel {
        return new Survey(jsonObj)
    }
    protected getDefaultTemplate(): string { return template.window.ko.html }
}