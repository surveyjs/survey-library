/// <reference path="template.ko.html.ts" />
/// <reference path="../templateText.ts" />
namespace Survey {
    export class SurveyTemplateText extends SurveyTemplateTextBase {
        protected get text(): string { return template.ko.html; }
        protected set text(value: string) { template.ko.html = value; }
    }
}
