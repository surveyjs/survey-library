// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { QuestionCheckboxBase } from "./question_baseselect";
export declare class QuestionRadiogroupModel extends QuestionCheckboxBase {
    name: string;
    constructor(name: string);
    getType(): string;
    supportGoNextPageAutomatic(): boolean;
}
