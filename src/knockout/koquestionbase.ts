import * as ko from "knockout";
import {QuestionBase} from "../questionbase";

export class QuestionImplementorBase {
    koVisible: any; koErrors: any; koPaddingLeft: any; koPaddingRight: any; koRenderWidth: any; koTemplateName: any;
    constructor(public question: QuestionBase) {
        var self = this;
        question.visibilityChangedCallback = function () { self.onVisibilityChanged(); };
        question.renderWidthChangedCallback = function () { self.onRenderWidthChanged(); };
        this.koTemplateName = ko.pureComputed(function () { return self.getTemplateName(); });
        this.koVisible = ko.observable(this.question.isVisible);
        this.koRenderWidth = ko.observable(this.question.renderWidth);
        this.koErrors = ko.observableArray();
        this.koPaddingLeft = ko.observable(self.getIndentSize(self.question.indent));
        this.koPaddingRight = ko.observable(self.getIndentSize(self.question.rightIndent));
        this.question["koTemplateName"] = this.koTemplateName;
        this.question["koVisible"] = this.koVisible;
        this.question["koRenderWidth"] = this.koRenderWidth;
        this.question["koErrors"] = this.koErrors;
        this.question["koPaddingLeft"] = this.koPaddingLeft;
        this.question["koPaddingRight"] = this.koPaddingRight;
        this.question["updateQuestion"] = function () { self.updateQuestion(); }
    }
    protected updateQuestion() {  }
    protected onVisibilityChanged() {
        this.koVisible(this.question.isVisible);
    }
    protected onRenderWidthChanged() {
        this.koRenderWidth(this.question.renderWidth);
        this.koPaddingLeft(this.getIndentSize(this.question.indent));
        this.koPaddingRight(this.getIndentSize(this.question.rightIndent));
    }
    private getIndentSize(indent: number): string {
        if (indent < 1) return "";
        if (!this.question["data"]) return "";
        var css = this.question["data"]["css"];
        if (!css) return "";
        return indent * css.question.indent + "px";
    }
    private getTemplateName(): string {
        if (this.question.customWidget && !this.question.customWidget.widgetJson.isDefaultRender)
            return "survey-widget-" + this.question.customWidget.name;
        return "survey-question-" + this.question.getType();
    }
}
