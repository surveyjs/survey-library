// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { Base, HashTable } from "./base";
export declare class Trigger extends Base {
    static operatorsValue: HashTable<Function>;
    static operators: HashTable<Function>;
    private opValue;
    value: any;
    constructor();
    operator: string;
    check(value: any): void;
    protected onSuccess(): void;
    protected onFailure(): void;
}
export interface ISurveyTriggerOwner {
    getObjects(pages: string[], questions: string[]): any[];
    doComplete(): any;
    setTriggerValue(name: string, value: any, isVariable: boolean): any;
}
export declare class SurveyTrigger extends Trigger {
    name: string;
    protected owner: ISurveyTriggerOwner;
    constructor();
    setOwner(owner: ISurveyTriggerOwner): void;
    isOnNextPage: boolean;
}
export declare class SurveyTriggerVisible extends SurveyTrigger {
    pages: string[];
    questions: string[];
    constructor();
    getType(): string;
    protected onSuccess(): void;
    protected onFailure(): void;
    private onTrigger(func);
    protected onItemSuccess(item: any): void;
    protected onItemFailure(item: any): void;
}
export declare class SurveyTriggerComplete extends SurveyTrigger {
    constructor();
    getType(): string;
    isOnNextPage: boolean;
    protected onSuccess(): void;
}
export declare class SurveyTriggerSetValue extends SurveyTrigger {
    setToName: string;
    setValue: any;
    isVariable: boolean;
    constructor();
    getType(): string;
    protected onSuccess(): void;
}
