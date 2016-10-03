/// <reference path="template.ko.html.ts" />
/// <reference path="../kosurvey.ts" />
/// <reference path="../../defaultCss/cssstandard.ts" />
namespace Survey {
    export class Survey extends SurveyBase {
        constructor(jsonObj: any = null, renderedElement: any = null, css: any = null) {
            super(jsonObj, renderedElement, css);
        }
        protected getTemplate(): string { return template.ko.html; }
        protected createCssObject(): any {  return defaultStandardCss; }
    }
}
