import {html} from './template.ko.html'
import SurveyBase from "../kosurvey";
import defaultStandardCss from "../../defaultCss/cssstandard";

export default class Survey extends SurveyBase {
    constructor(jsonObj: any = null, renderedElement: any = null, css: any = null) {
        super(jsonObj, renderedElement, css);
    }
    protected getTemplate(): string { return html; }
    protected createCssObject(): any {  return defaultStandardCss; }
}
