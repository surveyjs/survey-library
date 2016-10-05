import {html} from './template.window.ko.html'
import Survey from './koSurveybootstrap';
import SurveyWindowBase from "../koSurveyWindow";
import SurveyModel from "../../survey";

export default class SurveyWindow extends SurveyWindowBase {
    koExpanded: any;
    doExpand: any;
    constructor(jsonObj: any) {
        super(jsonObj);
    }
    protected createSurvey(jsonObj: any): SurveyModel {
        return new Survey(jsonObj)
    }
    protected getDefaultTemplate(): string { return html }
}