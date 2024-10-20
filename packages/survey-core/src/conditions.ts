import { HashTable, Helpers } from "./helpers";
import { ProcessValue } from "./conditionProcessValue";
import { ConsoleWarnings } from "./console-warnings";
import { Operand, FunctionOperand, AsyncFunctionItem } from "./expressions/expressions";
import { ConditionsParser } from "./conditionsParser";

/**
 * Base interface for expression execution
 */
export interface IExpresionExecutor {
  /**
   * This call back runs on executing expression if there is at least one async function
   */
  onComplete: (res: any, id: number) => void;
  /**
   * The expression as string, property with get
   */
  expression: string;
  /**
   * Returns true if the expression is valid and can be executed
   */
  canRun(): boolean;
  /**
   * Run the expression. Returns the result of execution.
   * The result can be undefined if there is an asyn function. In this case result will be returned onComplete callback.
   * @param values has with values names and their results. Normally it is question names and their values
   * @param properties the list of properties that are available in functions. Commonly it is survey and question, if expression execuited in a question context
   */
  run(values: HashTable<any>, properties: HashTable<any>, id: number): any;
  /**
   * Returns the list of variables that used in the expression. They defined as: {variableName} in default parser.
   */
  getVariables(): Array<string>;
  /**
   * Returns true if there is a function in the expression
   */
  hasFunction(): boolean;
  /**
   * Returns true if there is an async function in the expression
   */
  isAsync: boolean;
}

export class ExpressionExecutorRunner {
  private processValue: ProcessValue;
  private asyncFuncList: Array<AsyncFunctionItem>;
  constructor(private operand: Operand, private id: number, private onComplete: (res: any, id: number) => void, values: HashTable<any>, properties: HashTable<any>) {
    this.processValue = new ProcessValue();
    this.processValue.values = values;
    this.processValue.properties = properties;
  }
  public run(isAsync: boolean): any {
    if (!isAsync) return this.runValues();
    this.processValue.values = Helpers.createCopy(this.processValue.values);
    this.processValue.onCompleteAsyncFunc = (op: any): void => {
      const item = this.getAsyncItemByOperand(op, this.asyncFuncList);
      if(item) {
        this.doAsyncFunctionReady(item);
      }
    };
    this.asyncFuncList = new Array<AsyncFunctionItem>();
    this.operand.addToAsyncList(this.asyncFuncList);
    for (var i = 0; i < this.asyncFuncList.length; i++) {
      this.runAsyncItem(this.asyncFuncList[i]);
    }
    return false;
  }
  private getAsyncItemByOperand(op: FunctionOperand, list: Array<AsyncFunctionItem>): AsyncFunctionItem {
    if(!Array.isArray(list)) return null;
    for(let i = 0; i < list.length; i ++) {
      if(list[i].operand === op) return list[i];
      const res = this.getAsyncItemByOperand(op, list[i].children);
      if(!!res) return res;
    }
    return null;
  }
  private runAsyncItem(item: AsyncFunctionItem): void {
    if(item.children) {
      item.children.forEach(child => this.runAsyncItem(child));
    } else {
      this.runAsyncItemCore(item);
    }
  }
  private runAsyncItemCore(item: AsyncFunctionItem): void {
    if(item.operand) {
      item.operand.evaluate(this.processValue);
    } else {
      this.doAsyncFunctionReady(item);
    }
  }
  private doAsyncFunctionReady(item: AsyncFunctionItem): void {
    if(item.parent && this.isAsyncChildrenReady(item)) {
      this.runAsyncItemCore(item.parent);
      return;
    }
    for (var i = 0; i < this.asyncFuncList.length; i++) {
      if (!this.isAsyncFuncReady(this.asyncFuncList[i])) return;
    }
    this.runValues();
  }
  private isAsyncFuncReady(item: AsyncFunctionItem): boolean {
    if(item.operand && !item.operand.isReady(this.processValue)) return false;
    return this.isAsyncChildrenReady(item);
  }
  private isAsyncChildrenReady(item: AsyncFunctionItem): boolean {
    if(item.children) {
      for(let i = 0; i < item.children.length; i ++) {
        if(!this.isAsyncFuncReady(item.children[i])) return false;
      }
    }
    return true;
  }
  private runValues(): any {
    var res = this.operand.evaluate(this.processValue);
    if(!!this.onComplete) {
      this.onComplete(res, this.id);
    }
    return res;
  }
}

export class ExpressionExecutor implements IExpresionExecutor {
  public static createExpressionExecutor: (expression: string) => IExpresionExecutor =
    (expression: string) => { return new ExpressionExecutor(expression); }
  public onComplete: (res: any, id: number) => void;
  private expressionValue: string;
  private operand: Operand;
  private parser = new ConditionsParser();
  private isAsyncValue: boolean = false;
  private hasFunctionValue: boolean = false;
  constructor(expression: string) {
    this.setExpression(expression);
  }
  public get expression(): string {
    return this.expressionValue;
  }
  private setExpression(value: string): void {
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
  public get isAsync(): boolean {
    return this.isAsyncValue;
  }

  public canRun(): boolean {
    return !!this.operand;
  }

  public run(values: HashTable<any>, properties: HashTable<any> = null, id: number): any {
    if (!this.operand) {
      if(!!this.expression) {
        ConsoleWarnings.warn("Invalid expression: " + this.expression);
      }
      return null;
    }
    const runner = new ExpressionExecutorRunner(this.operand, id, this.onComplete, values, properties);
    return runner.run(this.isAsync);
  }
}

export class ExpressionRunnerBase {
  private expressionExecutor: IExpresionExecutor;
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
    if(!!this.expressionExecutor && value === this.expression) return;
    this.expressionExecutor = ExpressionExecutor.createExpressionExecutor(value);
    this.expressionExecutor.onComplete = (res: any, id: number) => { this.doOnComplete(res, id); };
    this.variables = undefined;
    this.containsFunc = undefined;
  }

  public getVariables(): Array<string> {
    if(this.variables === undefined) {
      this.variables = this.expressionExecutor.getVariables();
    }
    return this.variables;
  }

  public hasFunction(): boolean {
    if(this.containsFunc === undefined) {
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
  protected runCore(values: HashTable<any>, properties: HashTable<any> = null): any {
    const id = ExpressionRunnerBase.IdRunnerCounter ++;
    if(this.onBeforeAsyncRun && this.isAsync) {
      this.onBeforeAsyncRun(id);
    }
    return this.expressionExecutor.run(values, properties, id);
  }
  protected doOnComplete(res: any, id: number): void {
    if(this.onAfterAsyncRun && this.isAsync) {
      this.onAfterAsyncRun(id);
    }
  }
}

export class ConditionRunner extends ExpressionRunnerBase {
  public onRunComplete: (result: boolean) => void;
  public run(values: HashTable<any>, properties: HashTable<any> = null): boolean {
    return this.runCore(values, properties) == true;
  }
  protected doOnComplete(res: any, id: number): void {
    if (!!this.onRunComplete) this.onRunComplete(res == true);
    super.doOnComplete(res, id);
  }
}

export class ExpressionRunner extends ExpressionRunnerBase {
  public onRunComplete: (result: any) => void;
  public run(values: HashTable<any>, properties: HashTable<any> = null): any {
    return this.runCore(values, properties);
  }
  protected doOnComplete(res: any, id: number): void {
    if (!!this.onRunComplete) this.onRunComplete(res);
    super.doOnComplete(res, id);
  }
}
