﻿/// <reference path="koquestion.ts" />
namespace Survey {
    export class QuestionSelectBaseImplementor extends QuestionImplementor{
        private koChoiceChangedCount: any;
        koOtherVisible: any; koVisibleChoices: any; 
        constructor(question: Question) {
            super(question);
            var self = this;

            this.koChoiceChangedCount = ko.observable(0);
            this.koOtherVisible = ko.computed(function () { self.koValue(); return self.isOtherSelected; });
            this.koVisibleChoices = ko.computed(function () { self.koChoiceChangedCount(); return (<QuestionCheckboxBase>self.question).visibleChoices; });
            (<QuestionCheckboxBase>question).choicesChangedCallback = function () { self.koChoiceChangedCount(self.koChoiceChangedCount() + 1); };
            this.question["koOtherVisible"] = this.koOtherVisible;
            this.question["koVisibleChoices"] = this.koVisibleChoices;
        }
        protected get isOtherSelected(): boolean {
            return (<QuestionSelectBase>this.question).isOtherSelected;
        }
    }
    export class QuestionCheckboxBaseImplementor extends QuestionSelectBaseImplementor {
        koWidth: any;
        constructor(question: Question) {
            super(question);
            this.koWidth = ko.observable(this.colWidth);
            this.question["koWidth"] = this.koWidth;
            this.question["koAfterRender"] = this.koAfterRender;
            var self = this;
            (<QuestionCheckboxBase>this.question).colCountChangedCallback = function () { self.onColCountChanged(); };
        }
        protected onColCountChanged() {
            this.question["koWidth"] = ko.observable(this.colWidth);
        }
        protected get colWidth(): string {
            var colCount = (<QuestionCheckboxBase>this.question).colCount;
            return colCount > 0 ? (100 / colCount) + '%' : "";
        }
        private koAfterRender(el, con) {
            var tEl = el[0];
            if (tEl.nodeName == "#text") tEl.data = "";
            tEl = el[el.length - 1];
            if (tEl.nodeName == "#text") tEl.data = "";
        }
    }
}