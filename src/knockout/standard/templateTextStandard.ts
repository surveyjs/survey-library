/// <reference path="template.ko.html.ts" /> // TODO need to understand
import SurveyTemplateTextBase from "../templateText";

export default class SurveyTemplateText extends SurveyTemplateTextBase {
    protected get text(): string { return template.ko.html; }
    protected set text(value: string) { template.ko.html = value; }
}
