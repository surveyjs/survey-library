/// <reference path="../kosurveywindow.ts" />
/// <reference path="kosurveystandard.ts" />
module Survey {
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
}