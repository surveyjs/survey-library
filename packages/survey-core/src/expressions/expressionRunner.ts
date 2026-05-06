import { HashTable } from "../helpers";
import { IValueGetterContext, VariableGetterContextEx } from "../conditions/conditionProcessValue";
import { IExpressionValidationOptions } from "../base";
import { IExpressionError } from "./expressionError";
import type { IExpressionExecutorBase } from "./expressionExecutor";

export { IExpressionExecutorBase };

export var createExpressionExecutor: (expression: string) => IExpressionExecutorBase;
export function setCreateExpressionExecutor(func: (expression: string) => IExpressionExecutorBase): void {
  createExpressionExecutor = func;
}

export class ExpressionRunnerBase {
  private expressionExecutor: IExpressionExecutorBase;
  private variables: string[];
  private containsFunc: boolean;
  private static IdRunnerCounter = 1;
  public onBeforeAsyncRun: (id: number) => void;
  public onAfterAsyncRun: (id: number) => void;

  public constructor(expression: string) {
    this.expression = expression;
  }
  public get expression(): string {
    return !!this.expressionExecutor ? this.expressionExecutor.expression : "";
  }

  public set expression(value: string) {
    if (!!this.expressionExecutor && value === this.expression) return;
    this.expressionExecutor = createExpressionExecutor(value);
    this.expressionExecutor.onComplete = (res: any, id: number) => { this.doOnComplete(res, id); };
    this.variables = undefined;
    this.containsFunc = undefined;
  }

  public getVariables(): Array<string> {
    if (this.variables === undefined) {
      this.variables = this.expressionExecutor.getVariables();
    }
    return this.variables;
  }

  public hasFunction(noParamsOnly?: boolean): boolean {
    if (noParamsOnly === true) return !!this.expressionExecutor && this.expressionExecutor.hasFunction(true);
    if (this.containsFunc === undefined) {
      this.containsFunc = this.expressionExecutor.hasFunction();
    }
    return this.containsFunc;
  }
  public get isAsync(): boolean {
    return this.expressionExecutor.isAsync;
  }

  public canRun(): boolean {
    return this.expressionExecutor.canRun();
  }
  public runContextCore(context: IValueGetterContext, properties?: HashTable<any>): any {
    const id = ExpressionRunnerBase.IdRunnerCounter ++;
    if (this.onBeforeAsyncRun && this.isAsync) {
      this.onBeforeAsyncRun(id);
    }
    return this.expressionExecutor.runContext(context, properties, id);
  }
  public validate(context: IValueGetterContext, options: IExpressionValidationOptions, isCondition: boolean): IExpressionError[] {
    return this.expressionExecutor.validate(context, isCondition, options);
  }
  protected doOnComplete(res: any, id: number): void {
    if (this.onAfterAsyncRun && this.isAsync) {
      this.onAfterAsyncRun(id);
    }
  }
}

export class ExpressionRunner extends ExpressionRunnerBase {
  public onRunComplete: (result: any) => void;
  public runValues(values: HashTable<any>, properties?: HashTable<any>): any {
    return this.runContext(new VariableGetterContextEx(values, properties?.context), properties);
  }
  public runContext(context: IValueGetterContext, properties?: HashTable<any>): any {
    return this.runContextCore(context, properties);
  }
  protected doOnComplete(res: any, id: number): void {
    if (!!this.onRunComplete)this.onRunComplete(res);
    super.doOnComplete(res, id);
  }
}
