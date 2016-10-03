/// <reference path="../question_html.ts" />
/// <reference path="koquestionbase.ts" />
namespace Survey {
    export class QuestionHtml extends QuestionHtmlModel {
        constructor(public name: string) {
            super(name);
            new QuestionImplementorBase(this);
        }
    }

    JsonObject.metaData.overrideClassCreatore("html", function () { return new QuestionHtml(""); });
    QuestionFactory.Instance.registerQuestion("html", (name) => { return new QuestionHtml(name); });
}