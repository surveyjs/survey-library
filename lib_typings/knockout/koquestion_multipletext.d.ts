// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { QuestionMultipleTextModel, MultipleTextItemModel } from "../question_multipletext";
import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";
export declare class MultipleTextItem extends MultipleTextItemModel {
    name: any;
    private isKOValueUpdating;
    koValue: any;
    constructor(name?: any, title?: string);
    onValueChanged(newValue: any): void;
}
export declare class QuestionMultipleTextImplementor extends QuestionImplementor {
    koRows: any;
    constructor(question: Question);
    protected onColCountChanged(): void;
}
export declare class QuestionMultipleText extends QuestionMultipleTextModel {
    name: string;
    constructor(name: string);
    protected createTextItem(name: string, title: string): MultipleTextItemModel;
}
