// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

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
}
