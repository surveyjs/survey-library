// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { QuestionBase } from "./questionbase";
export declare class QuestionHtmlModel extends QuestionBase {
    name: string;
    private htmlValue;
    constructor(name: string);
    getType(): string;
    html: string;
    processedHtml: string;
}
