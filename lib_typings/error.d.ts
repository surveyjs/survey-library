// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { SurveyError } from "./base";
export declare class AnswerRequiredError extends SurveyError {
    constructor();
    getText(): string;
}
export declare class RequreNumericError extends SurveyError {
    constructor();
    getText(): string;
}
export declare class ExceedSizeError extends SurveyError {
    private maxSize;
    constructor(maxSize: number);
    getText(): string;
    private getTextSize();
}
export declare class CustomError extends SurveyError {
    private text;
    constructor(text: string);
    getText(): string;
}
