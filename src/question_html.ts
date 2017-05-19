import {QuestionBase} from "./questionbase";
import {JsonObject} from "./jsonobject";
import {QuestionFactory} from "./questionfactory";
import {LocalizableString} from "./localizablestring";

/**
 * A Model for html question. Unlike other questions it doesn't have value and title.
 */
export class QuestionHtmlModel extends QuestionBase {
    private locHtmlValue: LocalizableString;
    constructor(public name: string) {
        super(name);
        this.locHtmlValue = new LocalizableString(this);
    }
    public getType(): string {
        return "html";
    }
    public get html(): string { return this.locHtml.text; }
    public set html(value: string) { this.locHtml.text = value; }
    get locHtml(): LocalizableString { return this.locHtmlValue; }
    public get processedHtml() { return this.survey ? this.survey.processHtml(this.html) : this.html; }
}
JsonObject.metaData.addClass("html", [{name:"html:html", serializationProperty: "locHtml"}], function () { return new QuestionHtmlModel(""); }, "questionbase");
QuestionFactory.Instance.registerQuestion("html", (name) => { return new QuestionHtmlModel(name); });
