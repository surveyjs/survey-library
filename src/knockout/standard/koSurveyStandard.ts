/// <reference path="template.ko.html.ts" /> //TODO need to understand
import SurveyBase from "../kosurvey";
import defaultStandardCss from "../../defaultCss/cssstandard";

export default class Survey extends SurveyBase {
    constructor(jsonObj: any = null, renderedElement: any = null, css: any = null) {
        super(jsonObj, renderedElement, css);
    }
    protected getTemplate(): string { return template.ko.html; }
    protected createCssObject(): any {  return defaultStandardCss; }
}
