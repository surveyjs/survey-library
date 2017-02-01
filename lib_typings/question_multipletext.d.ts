// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

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
    placeHolder: string;
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
    addItem(name: string, title?: string): MultipleTextItemModel;
    private AddItem(name, title?);
    supportGoNextPageAutomatic(): boolean;
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
