// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

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
export declare class Event<T extends Function, Options> {
    private callbacks;
    isEmpty: boolean;
    fire(sender: any, options: Options): void;
    add(func: T): void;
    remove(func: T): void;
}
