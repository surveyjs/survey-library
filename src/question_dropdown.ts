// <reference path="question_selectbase.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
namespace Survey {
    export class QuestionDropdownModel extends QuestionSelectBase {
        private optionsCaptionValue: string;
        constructor(public name: string) {
            super(name);
        }
        public get optionsCaption() { return (this.optionsCaptionValue) ? this.optionsCaptionValue : surveyLocalization.getString("optionsCaption"); }
        public set optionsCaption(newValue: string) { this.optionsCaptionValue = newValue; }
        public getType(): string {
            return "dropdown";
        }
        supportGoNextPageAutomatic() { return true; }
    }
    JsonObject.metaData.addClass("dropdown", [{ name: "optionsCaption", onGetValue: function (obj: any) { return obj.optionsCaptionValue; }}],
        function () { return new QuestionDropdownModel(""); }, "selectbase");
    QuestionFactory.Instance.registerQuestion("dropdown", (name) => { var q = new QuestionDropdownModel(name); q.choices = QuestionFactory.DefaultChoices; return q; });
}