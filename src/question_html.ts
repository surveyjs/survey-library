// <reference path="questionbase.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
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
}