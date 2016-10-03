/// <reference path="../questionbase.ts" />
namespace Survey {
    export class QuestionImplementorBase {
        koVisible: any; koErrors: any; koMarginLeft: any; koPaddingRight: any; koRenderWidth: any;
        constructor(public question: QuestionBase) {
            var self = this;
            question.visibilityChangedCallback = function () { self.onVisibilityChanged(); };
            question.renderWidthChangedCallback = function () { self.onRenderWidthChanged(); };
            this.koVisible = ko.observable(this.question.visible);
            this.koRenderWidth = ko.observable(this.question.renderWidth);
            this.koErrors = ko.observableArray();
            this.koMarginLeft = ko.pureComputed(function () { self.koRenderWidth(); return self.getIndentSize(self.question.indent); });
            this.koPaddingRight = ko.observable(self.getIndentSize(self.question.rightIndent)); 
            this.question["koVisible"] = this.koVisible;
            this.question["koRenderWidth"] = this.koRenderWidth;
            this.question["koErrors"] = this.koErrors;
            this.question["koMarginLeft"] = this.koMarginLeft;
            this.question["koPaddingRight"] = this.koPaddingRight;
        }
        protected onVisibilityChanged() {
            this.koVisible(this.question.visible);
        }
        protected onRenderWidthChanged() {
            this.koRenderWidth(this.question.renderWidth);
            this.koPaddingRight(this.getIndentSize(this.question.rightIndent)); 
        }
        private getIndentSize(indent: number): string {
            if (indent < 1) return "";
            if (!this.question["data"]) return "";
            var css = this.question["data"]["css"];
            if (!css) return "";
            return indent * css.question.indent + "px";
        }
    }
}