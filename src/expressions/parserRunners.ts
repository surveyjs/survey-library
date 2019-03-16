import { HashTable } from "../helpers";

import { ProcessValue } from "../conditionProcessValue";

import { Operand } from "./expressions";
import { SyntaxError, parse } from "./expressionParser";

export class ParserErrorHandler {
    constructor(private error: Error) {}
}

export class ConditionRunner {
    private expressionValue: string;
    private processValue: ProcessValue;
    private operand: Operand;
    private parserError: ParserErrorHandler;

    public constructor(expression: string) {
        this.expression = expression;
        this.processValue = new ProcessValue();
    }

    public get expression(): string {
        return this.expressionValue;
    }

    public set expression(value: string) {
        if (this.expression === value) return;
        this.expressionValue = value;
        this.doParse();
    }

    public getParserError() {
        return this.parserError;
    }

    private doParse() {
        if (this.parserError == null) {
            try {
                this.operand = parse(this.expressionValue);
            } catch (ex) {
                this.parserError = new ParserErrorHandler(ex);
            }
        }
    }

    public run(values: HashTable<any>, properties: HashTable<any> = null): any {
        if (!this.operand) {
            this.doParse();
        }

        this.processValue.values = values;
        this.processValue.properties = properties;
        return this.operand.evaluate(this.processValue);
    }
}

export class ExpressionRunner extends ConditionRunner {}
