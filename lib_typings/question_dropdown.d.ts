// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { QuestionSelectBase } from "./question_baseselect";
export declare class QuestionDropdownModel extends QuestionSelectBase {
    name: string;
    private optionsCaptionValue;
    constructor(name: string);
    optionsCaption: string;
    getType(): string;
    supportGoNextPageAutomatic(): boolean;
}
