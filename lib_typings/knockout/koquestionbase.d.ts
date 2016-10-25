// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { QuestionBase } from "../questionbase";
export declare class QuestionImplementorBase {
    question: QuestionBase;
    koVisible: any;
    koErrors: any;
    koMarginLeft: any;
    koPaddingRight: any;
    koRenderWidth: any;
    constructor(question: QuestionBase);
    protected onVisibilityChanged(): void;
    protected onRenderWidthChanged(): void;
    private getIndentSize(indent);
}
