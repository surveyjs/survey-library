// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { Base } from "./base";
import { SurveyValidator, IValidatorOwner } from "./validator";
import { Question } from "./question";
import { SurveyError } from "./base";
export interface IMultipleTextData {
    getMultipleTextValue(name: string): any;
    setMultipleTextValue(name: string, value: any): any;
}
export declare class MultipleTextItemModel extends Base implements IValidatorOwner {
    name: any;
    private data;
    private titleValue;
    validators: Array<SurveyValidator>;
    constructor(name?: any, title?: string);
    getType(): string;
    setData(data: IMultipleTextData): void;
    title: string;
    value: any;
    onValueChanged(newValue: any): void;
    getValidatorTitle(): string;
}
export declare class QuestionMultipleTextModel extends Question implements IMultipleTextData {
    name: string;
    private colCountValue;
    colCountChangedCallback: () => void;
    itemSize: number;
    private itemsValues;
    constructor(name: string);
    getType(): string;
    items: Array<MultipleTextItemModel>;
    AddItem(name: string, title?: string): MultipleTextItemModel;
    colCount: number;
    getRows(): Array<any>;
    private isMultipleItemValueChanging;
    protected onValueChanged(): void;
    protected createTextItem(name: string, title: string): MultipleTextItemModel;
    protected onItemValueChanged(): void;
    protected runValidators(): SurveyError;
    getMultipleTextValue(name: string): any;
    setMultipleTextValue(name: string, value: any): void;
}
