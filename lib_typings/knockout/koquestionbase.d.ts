// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { QuestionBase } from "../questionbase";
export declare class QuestionImplementorBase {
    question: QuestionBase;
    koVisible: any;
    koErrors: any;
    koMarginLeft: any;
    koPaddingRight: any;
    koRenderWidth: any;
    constructor(question: QuestionBase);
    protected updateQuestion(): void;
    protected onVisibilityChanged(): void;
    protected onRenderWidthChanged(): void;
    private getIndentSize(indent);
}
