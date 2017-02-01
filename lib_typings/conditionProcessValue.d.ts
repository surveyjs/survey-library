// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { HashTable } from './base';
export declare class ProcessValue {
    constructor();
    getFirstName(text: string): string;
    hasValue(text: string, values: HashTable<any>): boolean;
    getValue(text: string, values: HashTable<any>): any;
    private getValueCore(text, values);
    private getIntValue(str);
}
