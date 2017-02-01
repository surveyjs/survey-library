// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

export declare class SurveyTemplateText {
    constructor();
    replaceText(replaceText: string, id: string, questionType?: string): void;
    protected getId(id: string, questionType: string): string;
    protected text: string;
}
