// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import QuestionDateModel from "../question_date";
import { Question } from "../../question";
import { QuestionImplementor } from "../../knockout/koquestion";
export declare class QuestionDateImplementor extends QuestionImplementor {
    constructor(question: Question);
    protected koQuestionAfterRender(el: any, con: any): void;
    private inputId;
}
export declare class QuestionDate extends QuestionDateModel {
    name: string;
    constructor(name: string);
}
