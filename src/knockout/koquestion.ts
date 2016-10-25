import * as ko from "knockout";
import {QuestionImplementorBase} from "./koquestionbase";
import {Question} from "../question";

export class QuestionImplementor extends QuestionImplementorBase {
    private isUpdating: boolean = false;
    private koDummy: any;
    koValue: any; koComment: any; koTitle: any;
    constructor(public question: Question) {
        super(question);
        var self = this;
        question.valueChangedCallback = function () { self.onValueChanged(); };
        question.commentChangedCallback = function () { self.onCommentChanged(); };
        question.errorsChangedCallback = function () { self.onErrorsChanged(); };
        question.titleChangedCallback = function () { self.onVisibleIndexChanged(); };
        question.visibleIndexChangedCallback = function () { self.onVisibleIndexChanged(); };
        this.koDummy = ko.observable(0);
        this.koValue = this.createkoValue();
        this.koComment = ko.observable(this.question.comment);
        this.koTitle = ko.pureComputed(function () { self.koDummy(); return self.question.fullTitle; });
        this.koErrors(this.question.errors);
        this.koValue.subscribe(function (newValue) {
            self.updateValue(newValue);
        });
        this.koComment.subscribe(function (newValue) {
            self.updateComment(newValue);
        });
        this.question["koValue"] = this.koValue;
        this.question["koComment"] = this.koComment;
        this.question["koTitle"] = this.koTitle;
    }
    protected onValueChanged() {
        if (this.isUpdating) return;
        this.setkoValue(this.question.value);
    }
    protected onCommentChanged() {
        if (this.isUpdating) return;
        this.koComment(this.question.comment);
    }
    protected onVisibilityChanged() {
        this.koVisible(this.question.visible);
    }
    protected onVisibleIndexChanged() {
        this.koDummy(this.koDummy() + 1);
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
}