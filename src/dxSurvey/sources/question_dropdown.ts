// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
module dxSurvey {
    export class QuestionDropdown extends Question {
        otherString : string = "Other (describe)";
        choices: Array<string> = new Array<string>();
        koOtherVisible: any;
        constructor(public name: string) {
            super(name);
            if (this.isKO) {
                var self = this;
                this.koOtherVisible = ko.computed(function () { return self.koValue() == self.otherString; });
            }
        }
        public getType(): string {
            return "dropdown";
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
    QuestionFactory.Instance.registerQuestion("dropdown", (name) => { return new QuestionDropdown(name); });
}