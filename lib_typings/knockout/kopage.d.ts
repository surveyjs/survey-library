// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { PageModel, QuestionRowModel } from "../page";
import { QuestionBase } from "../questionbase";
export declare class QuestionRow extends QuestionRowModel {
    page: PageModel;
    question: QuestionBase;
    koVisible: any;
    constructor(page: PageModel, question: QuestionBase);
    protected onVisibleChanged(): void;
    koAfterRender(el: any, con: any): void;
}
export declare class Page extends PageModel {
    koNo: any;
    constructor(name?: string);
    protected createRow(question: QuestionBase): QuestionRowModel;
    protected onCreating(): void;
    protected onNumChanged(value: number): void;
}
