// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { QuestionTextModel } from "../question_text";
import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";
export declare class QuestionTextImplementor extends QuestionImplementor {
    question: Question;
    constructor(question: Question);
    protected updateValue(newValue: any): void;
}
export declare class QuestionText extends QuestionTextModel {
    name: string;
    constructor(name: string);
}
