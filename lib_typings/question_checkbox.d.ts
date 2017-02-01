// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { QuestionCheckboxBase } from "./question_baseselect";
export declare class QuestionCheckboxModel extends QuestionCheckboxBase {
    name: string;
    constructor(name: string);
    protected getHasOther(val: any): boolean;
    protected valueFromDataCore(val: any): any;
    protected valueToDataCore(val: any): any;
    getType(): string;
}
