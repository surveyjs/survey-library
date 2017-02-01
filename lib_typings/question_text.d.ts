// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { Question } from "./question";
export declare class QuestionTextModel extends Question {
    name: string;
    size: number;
    inputType: string;
    placeHolder: string;
    constructor(name: string);
    getType(): string;
    isEmpty(): boolean;
    supportGoNextPageAutomatic(): boolean;
    protected setNewValue(newValue: any): void;
    protected correctValueType(newValue: any): any;
    private isNumber(value);
}
