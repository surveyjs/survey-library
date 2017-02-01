// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { Question } from "./question";
export declare class QuestionCommentModel extends Question {
    name: string;
    rows: number;
    cols: number;
    placeHolder: string;
    constructor(name: string);
    getType(): string;
    isEmpty(): boolean;
}
