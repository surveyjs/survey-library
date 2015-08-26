// <reference path="question.ts" />
/// <reference path="jsonobject.ts" />
module dxSurvey {
    export class QuestionSelectBase extends Question {
        otherString: string = "Other (describe)";
        choices: Array<string> = new Array<string>();
        koOtherVisible: any;
        constructor(name: string) {
            super(name);
            if (this.isKO) {
                var self = this;
                this.koOtherVisible = ko.computed(function () { return self.iskoOtherVisible(); });
            }
        }
        protected iskoOtherVisible(): boolean {
            return this.koValue() == this.otherString;
        }
        get visibleChoices(): Array<string> {
            if (!this.hasOther) return this.choices;
            var result = this.choices.slice();
            result.push(this.otherString);
            return result;
        }
        public supportComment(): boolean { return true; }
        public supportOther(): boolean { return true; }
    }
    JsonObject.metaData.addClass("selectbase", ["choices"], null, "question");
}