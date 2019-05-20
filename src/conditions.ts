import { HashTable } from "./helpers";
import { ProcessValue } from "./conditionProcessValue";

import { Operand } from "./expressions/expressions";
import { ConditionsParser } from "./conditionsParser";

export class ExpressionRunnerBase {
  private expressionValue: string;
  private operand: Operand;
  private processValue = new ProcessValue();
  private parser = new ConditionsParser();

  public constructor(expression: string) {
    this.expression = expression;
  }

  public get expression(): string {
    return this.expressionValue;
  }

  public set expression(value: string) {
    if (this.expression === value) return;
    this.expressionValue = value;
    this.operand = this.parser.parseExpression(value);
  }

  public getVariables(): Array<string> {
    if (!this.operand) return [];

    var variables: Array<string> = [];
    this.operand.setVariables(variables);
    return variables;
  }

  public hasFunction(): boolean {
    if (this.canRun()) {
      return this.operand.hasFunction();
    }
    return false;
  }

  public canRun(): boolean {
    return !!this.operand;
  }

  protected runCore(values: HashTable<any>, properties: HashTable<any> = null): any {
    if (!this.operand) return null;

    this.processValue.values = values;
    this.processValue.properties = properties;
    return this.operand.evaluate(this.processValue);
  }
}

export class ConditionRunner extends ExpressionRunnerBase {
  public run(values: HashTable<any>, properties: HashTable<any> = null): boolean {
    return this.runCore(values, properties);
  }
}

export class ExpressionRunner extends ExpressionRunnerBase {
  public run(values: HashTable<any>, properties: HashTable<any> = null): any {
    return this.runCore(values, properties);
  }
}
