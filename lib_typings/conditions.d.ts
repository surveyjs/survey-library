// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { HashTable } from './base';
export declare class Condition {
    static operatorsValue: HashTable<Function>;
    static operators: HashTable<Function>;
    private opValue;
    left: any;
    right: any;
    operator: string;
    perform(left?: any, right?: any): boolean;
    private getPureValue(val);
}
export declare class ConditionNode {
    private connectiveValue;
    children: Array<any>;
    constructor();
    connective: string;
    isEmpty: boolean;
    clear(): void;
}
export declare class ConditionRunner {
    private expressionValue;
    private processValue;
    private root;
    private values;
    constructor(expression: string);
    expression: string;
    run(values: HashTable<any>): boolean;
    private runNode(node);
    private runNodeCondition(value);
    private runCondition(condition);
    private getValueName(nodeValue);
}
