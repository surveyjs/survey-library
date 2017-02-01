// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { QuestionFileModel } from "../question_file";
import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";
export declare class QuestionFileImplementor extends QuestionImplementor {
    koDataUpdater: any;
    koData: any;
    koHasValue: any;
    constructor(question: Question);
    private onChange(src);
    private onLoadPreview();
}
export declare class QuestionFile extends QuestionFileModel {
    name: string;
    constructor(name: string);
}
