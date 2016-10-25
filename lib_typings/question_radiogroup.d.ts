// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { QuestionCheckboxBase } from "./question_baseselect";
export declare class QuestionRadiogroupModel extends QuestionCheckboxBase {
    name: string;
    constructor(name: string);
    getType(): string;
    supportGoNextPageAutomatic(): boolean;
}
