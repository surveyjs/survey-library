// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";
export declare class QuestionSelectBaseImplementor extends QuestionImplementor {
    koOtherVisible: any;
    koVisibleChoices: any;
    constructor(question: Question);
    protected isOtherSelected: boolean;
}
export declare class QuestionCheckboxBaseImplementor extends QuestionSelectBaseImplementor {
    koWidth: any;
    constructor(question: Question);
    protected onColCountChanged(): void;
    protected colWidth: string;
    private koAfterRender(el, con);
}
