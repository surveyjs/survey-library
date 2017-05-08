import * as ko from "knockout";
import {QuestionImplementorBase} from "./koquestionbase";
import {Question} from "../question";
import {SurveyElement} from "../base";

export class QuestionImplementor extends QuestionImplementorBase {
    private isUpdating: boolean = false;
    private koDummy: any;
    koValue: any; koComment: any; koIsReadOnly: any;
    constructor(public question: Question) {
        super(question);
        var self = this;
        question.valueChangedCallback = function () { self.onValueChanged(); };
        question.commentChangedCallback = function () { self.onCommentChanged(); };
        question.errorsChangedCallback = function () { self.onErrorsChanged(); };
        question.titleChangedCallback = function () { self.onVisibleIndexChanged(); };
        question.visibleIndexChangedCallback = function () { self.onVisibleIndexChanged(); };
        question.readOnlyChangedCallback = function() {self.onReadOnlyChanged();}
        this.koDummy = ko.observable(0);
        this.koValue = this.createkoValue();
        this.koComment = ko.observable(this.question.comment);
        this.koErrors(this.question.errors);
        this.koIsReadOnly = ko.observable(this.question.isReadOnly);
        this.koValue.subscribe(function (newValue) {
            self.updateValue(newValue);
        });
        this.koComment.subscribe(function (newValue) {
            self.updateComment(newValue);
        });
        this.question["koValue"] = this.koValue;
        this.question["koComment"] = this.koComment;
        this.question["koIsReadOnly"] = this.koIsReadOnly;
        this.question["koQuestionAfterRender"] = function (el, con) { self.koQuestionAfterRender(el, con); };
    }
    protected updateQuestion() {
        this.updateKoDummy();
    }
    protected onValueChanged() {
        if (this.isUpdating) return;
        this.setkoValue(this.question.value);
    }
    protected onCommentChanged() {
        if (this.isUpdating) return;
        this.koComment(this.question.comment);
    }
    protected onVisibleIndexChanged() {
        this.updateKoDummy();
    }
    protected onReadOnlyChanged() {
        this.koIsReadOnly(this.question.isReadOnly);
    }
    protected onErrorsChanged() {
        this.koErrors(this.question.errors);
    }
    protected createkoValue(): any { return ko.observable(this.question.value); }
    protected setkoValue(newValue: any) {
        this.koValue(newValue);
    }
    protected updateValue(newValue: any) {
        this.isUpdating = true;
        this.question.value = newValue;
        this.isUpdating = false;
    }
    protected updateComment(newValue: any) {
        this.isUpdating = true;
        this.question.comment = newValue;
        this.isUpdating = false;
    }
    protected getNo(): string {
        return this.question.visibleIndex > -1 ? this.question.visibleIndex + 1 + ". " : "";
    }
    protected updateKoDummy() {
        this.koDummy(this.koDummy() + 1);
        this.question.locTitle.onChanged();
    }
    protected koQuestionAfterRender(elements, con) {
        var el = SurveyElement.GetFirstNonTextElement(elements);
        var tEl = elements[0];
        if (tEl.nodeName == "#text") tEl.data = "";
        tEl = elements[elements.length - 1];
        if (tEl.nodeName == "#text") tEl.data = "";
        if (el && this.question.customWidget) this.question.customWidget.afterRender(this.question, el);
    }
}
