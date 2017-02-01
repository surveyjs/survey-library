// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { QuestionImplementorBase } from "./koquestionbase";
import { Question } from "../question";
export declare class QuestionImplementor extends QuestionImplementorBase {
    question: Question;
    private isUpdating;
    private koDummy;
    koValue: any;
    koComment: any;
    koTitle: any;
    constructor(question: Question);
    protected updateQuestion(): void;
    protected onValueChanged(): void;
    protected onCommentChanged(): void;
    protected onVisibilityChanged(): void;
    protected onVisibleIndexChanged(): void;
    protected onErrorsChanged(): void;
    protected createkoValue(): any;
    protected setkoValue(newValue: any): void;
    protected updateValue(newValue: any): void;
    protected updateComment(newValue: any): void;
    protected getNo(): string;
    protected koQuestionAfterRender(el: any, con: any): void;
}
