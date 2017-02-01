// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

export interface HashTable<T> {
    [key: string]: T;
}
export interface ISurveyData {
    getValue(name: string): any;
    setValue(name: string, newValue: any): any;
    getComment(name: string): string;
    setComment(name: string, newValue: string): any;
}
export interface ISurvey extends ISurveyData {
    currentPage: IPage;
    pageVisibilityChanged(page: IPage, newValue: boolean): any;
    questionVisibilityChanged(question: IQuestion, newValue: boolean): any;
    questionAdded(question: IQuestion, index: number): any;
    questionRemoved(question: IQuestion): any;
    validateQuestion(name: string): SurveyError;
    processHtml(html: string): string;
    processText(text: string): string;
    isDesignMode: boolean;
    requiredText: string;
    questionStartIndex: string;
    questionTitleTemplate: string;
    storeOthersAsComment: boolean;
    uploadFile(name: string, file: File, storeDataAsText: boolean, uploadingCallback: (status: string) => any): boolean;
}
export interface IConditionRunner {
    runCondition(values: HashTable<any>): any;
}
export interface IQuestion extends IConditionRunner {
    name: string;
    visible: boolean;
    hasTitle: boolean;
    setVisibleIndex(value: number): any;
    onSurveyValueChanged(newValue: any): any;
    onSurveyLoad(): any;
    supportGoNextPageAutomatic(): boolean;
}
export interface IPage extends IConditionRunner {
    visible: boolean;
}
export declare class ItemValue {
    static Separator: string;
    static setData(items: Array<ItemValue>, values: Array<any>): void;
    static getData(items: Array<ItemValue>): any;
    static getItemByValue(items: Array<ItemValue>, val: any): ItemValue;
    private static itemValueProp;
    private static copyAttributes(src, dest, exceptons);
    private itemValue;
    private itemText;
    constructor(value: any, text?: string);
    getType(): string;
    value: any;
    hasText: boolean;
    text: string;
}
export declare class Base {
    getType(): string;
}
export declare class SurveyError {
    getText(): string;
}
export declare const SurveyPageId: string;
export declare class SurveyElement {
    static ScrollElementToTop(elementId: string): boolean;
    static FocusElement(elementId: string): boolean;
}
export declare class Event<T extends Function, Options> {
    private callbacks;
    isEmpty: boolean;
    fire(sender: any, options: Options): void;
    add(func: T): void;
    remove(func: T): void;
}
