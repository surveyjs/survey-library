import {QuestionBase} from "./questionbase";
import {JsonObject} from "./jsonobject";
import {QuestionFactory} from "./questionfactory";

export class QuestionHtmlModel extends QuestionBase {
    private htmlValue: string;
    constructor(public name: string) {
        super(name);
    }
    public getType(): string {
        return "html";
    }
    public get html(): string { return this.htmlValue; }
    public set html(value: string) {
        this.htmlValue = value;
    }
    public get processedHtml() { return this.survey ? this.survey.processHtml(this.html) : this.html; }
}
JsonObject.metaData.addClass("html", ["html:html"], function () { return new QuestionHtmlModel(""); }, "questionbase");
QuestionFactory.Instance.registerQuestion("html", (name) => { return new QuestionHtmlModel(name); });