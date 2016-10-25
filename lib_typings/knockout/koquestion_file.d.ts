// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

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
