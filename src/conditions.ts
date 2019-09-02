import { HashTable } from "./helpers";
import { ProcessValue } from "./conditionProcessValue";

import { Operand, FunctionOperand } from "./expressions/expressions";
import { ConditionsParser } from "./conditionsParser";

export class ExpressionRunnerBase {
  private expressionValue: string;
  private operand: Operand;
  private processValue = new ProcessValue();
  private parser = new ConditionsParser();
  private isAsyncValue: boolean = false;
  private hasFunctionValue: boolean = false;
  private asyncFuncList: Array<FunctionOperand>;

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
    this.hasFunctionValue = this.canRun() ? this.operand.hasFunction() : false;
    this.isAsyncValue = this.hasFunction()
      ? this.operand.hasAsyncFunction()
      : false;
  }

  public getVariables(): Array<string> {
    if (!this.operand) return [];

    var variables: Array<string> = [];
    this.operand.setVariables(variables);
    return variables;
  }

  public hasFunction(): boolean {
    return this.hasFunctionValue;
  }
  public get isAsync() {
    return this.isAsyncValue;
  }

  public canRun(): boolean {
    return !!this.operand;
  }

  protected runCore(
    values: HashTable<any>,
    properties: HashTable<any> = null
  ): any {
    if (!this.operand) return null;

    this.processValue.values = values;
    this.processValue.properties = properties;
    if (!this.isAsync) return this.runValues();
    this.asyncFuncList = [];
    this.operand.addToAsyncList(this.asyncFuncList);
    for (var i = 0; i < this.asyncFuncList.length; i++) {
      this.asyncFuncList[i].onAsyncReady = () => {
        this.doAsyncFunctionReady();
      };
    }
    for (var i = 0; i < this.asyncFuncList.length; i++) {
      this.asyncFuncList[i].evaluateAsync(this.processValue);
    }
    return false;
  }
  private doAsyncFunctionReady() {
    for (var i = 0; i < this.asyncFuncList.length; i++) {
      if (!this.asyncFuncList[i].isReady) return;
    }
    this.runValues();
  }
  private runValues(): any {
    var res = this.operand.evaluate(this.processValue);
    this.doOnComplete(res);
    return res;
  }
  protected doOnComplete(res: any) {}
}

export class ConditionRunner extends ExpressionRunnerBase {
  public onRunComplete: (result: boolean) => void;
  public run(
    values: HashTable<any>,
    properties: HashTable<any> = null
  ): boolean {
    return this.runCore(values, properties) == true;
  }
  protected doOnComplete(res: any) {
    if (!!this.onRunComplete) this.onRunComplete(res == true);
  }
}

export class ExpressionRunner extends ExpressionRunnerBase {
  public onRunComplete: (result: any) => void;
  public run(values: HashTable<any>, properties: HashTable<any> = null): any {
    return this.runCore(values, properties);
  }
  protected doOnComplete(res: any) {
    if (!!this.onRunComplete) this.onRunComplete(res);
  }
}
