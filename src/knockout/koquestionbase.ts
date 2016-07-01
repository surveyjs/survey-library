/// <reference path="../questionbase.ts" />
module Survey {
    export class QuestionImplementorBase {
        koVisible: any; koErrors: any; koMarginLeft: any;
        constructor(public question: QuestionBase) {
            var self = this;
            question.visibilityChangedCallback = function () { self.onVisibilityChanged(); };
            this.koVisible = ko.observable(this.question.visible);
            this.koErrors = ko.observableArray();
            this.koMarginLeft = ko.pureComputed(function () {
                if (self.question.indent < 1) return "";
                if (!self.question["data"]) return "";
                var css = self.question["data"]["css"];
                if (!css) return "";
                return self.question.indent * css.question.indent + "px";
            });
            this.question["koVisible"] = this.koVisible;
            this.question["koErrors"] = this.koErrors;
            this.question["koMarginLeft"] = this.koMarginLeft;
        }
        protected onVisibilityChanged() {
            this.koVisible(this.question.visible);
        }
    }
}