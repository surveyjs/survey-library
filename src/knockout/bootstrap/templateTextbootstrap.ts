import {html} from './template.ko.html'
import SurveyTemplateTextBase from "../templateText";

export default class SurveyTemplateText extends SurveyTemplateTextBase {
    template: string;

    constructor() {
        super();
        this.template = html;
    }

    protected get text(): string { return this.template; }
    protected set text(value: string) { this.template = value; }
}
