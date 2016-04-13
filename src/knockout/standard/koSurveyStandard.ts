/// <reference path="template.ko.html.ts" />
/// <reference path="../kosurvey.ts" />
module Survey {
    export class Survey extends SurveyBase {
        constructor(jsonObj: any = null, renderedElement: any = null) {
            super(jsonObj, renderedElement);
        }
        protected getTemplate(): string { return template.ko.html; }
    }
}
