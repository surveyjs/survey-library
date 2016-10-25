// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { Question } from "./question";
export declare class QuestionCommentModel extends Question {
    name: string;
    rows: number;
    cols: number;
    constructor(name: string);
    getType(): string;
    isEmpty(): boolean;
}
