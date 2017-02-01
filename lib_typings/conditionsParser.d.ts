// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { ConditionNode } from "./conditions";
export declare class ConditionsParser {
    private text;
    private root;
    private expressionNodes;
    private node;
    private at;
    private length;
    parse(text: string, root: ConditionNode): boolean;
    toString(root: ConditionNode): string;
    private toStringCore(value);
    private nodeToString(node);
    private conditionToString(condition);
    private operationToString(op);
    private isNumeric(value);
    private parseText();
    private readConditions();
    private readCondition();
    private readExpression();
    private ch;
    private skip();
    private isSpace(c);
    private isQuotes(c);
    private isOperatorChar(c);
    private isBrackets(c);
    private readString();
    private isNoRightOperation(op);
    private readOperator();
    private readConnective();
    private pushExpression();
    private popExpression();
    private addCondition(c);
    private addConnective(con);
}
