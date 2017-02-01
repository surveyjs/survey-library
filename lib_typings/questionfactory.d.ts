// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { QuestionBase } from './questionbase';
export declare class QuestionFactory {
    static Instance: QuestionFactory;
    static DefaultChoices: string[];
    private creatorHash;
    registerQuestion(questionType: string, questionCreator: (name: string) => QuestionBase): void;
    getAllTypes(): Array<string>;
    createQuestion(questionType: string, name: string): QuestionBase;
}
