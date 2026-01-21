import { HashTable } from "./helpers";
import { IValueGetterContext, ProcessValue, VariableGetterContextEx } from "./conditionProcessValue";
import { ConsoleWarnings } from "./console-warnings";
import { Operand, FunctionOperand, AsyncFunctionItem, Variable, Const } from "./expressions/expressions";
import { ConditionsParser } from "./conditionsParser";
import { FunctionFactory } from "./functionsfactory";
import { IExpressionValidationOptions } from "./base";

export enum ExpressionErrorType {
  SyntaxError,
  UnknownFunction,
  UnknownVariable,
  SemanticError
}

export interface IExpressionError {
  errorType: ExpressionErrorType;
  functionName?: string;
  variableName?: string;
}

/**
 * Base interface for expression execution
 */
export interface IExpressionExecutor {
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
  runContext(context: IValueGetterContext, properties: HashTable<any>, id: number): any;
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
  validate(context: IValueGetterContext, isCondition: boolean, options: IExpressionValidationOptions): IExpressionError[];
}

export class ExpressionExecutorRunner {
  private processValue: ProcessValue;
  private asyncFuncList: Array<AsyncFunctionItem>;
  constructor(private operand: Operand, private id: number, private onComplete: (res: any, id: number) => void, properties: HashTable<any>, context: IValueGetterContext) {
    this.processValue = new ProcessValue(context);
    this.processValue.properties = properties;
  }
  public run(isAsync: boolean): any {
    if (!isAsync) return this.runValues();
    this.processValue.onCompleteAsyncFunc = (op: any): void => {
      const item = this.getAsyncItemByOperand(op, this.asyncFuncList);
      if (item) {
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
    if (!Array.isArray(list)) return null;
    for (let i = 0; i < list.length; i ++) {
      if (list[i].operand === op) return list[i];
      const res = this.getAsyncItemByOperand(op, list[i].children);
      if (!!res) return res;
    }
    return null;
  }
  private runAsyncItem(item: AsyncFunctionItem): void {
    if (item.children) {
      item.children.forEach(child => this.runAsyncItem(child));
    } else {
      this.runAsyncItemCore(item);
    }
  }
  private runAsyncItemCore(item: AsyncFunctionItem): void {
    if (item.operand) {
      item.operand.evaluate(this.processValue);
    } else {
      this.doAsyncFunctionReady(item);
    }
  }
  private doAsyncFunctionReady(item: AsyncFunctionItem): void {
    if (item.parent && this.isAsyncChildrenReady(item)) {
      this.runAsyncItemCore(item.parent);
      return;
    }
    for (var i = 0; i < this.asyncFuncList.length; i++) {
      if (!this.isAsyncFuncReady(this.asyncFuncList[i])) return;
    }
    this.runValues();
  }
  private isAsyncFuncReady(item: AsyncFunctionItem): boolean {
    if (item.operand && !item.operand.isReady(this.processValue)) return false;
    return this.isAsyncChildrenReady(item);
  }
  private isAsyncChildrenReady(item: AsyncFunctionItem): boolean {
    if (item.children) {
      for (let i = 0; i < item.children.length; i ++) {
        if (!this.isAsyncFuncReady(item.children[i])) return false;
      }
    }
    return true;
  }
  private runValues(): any {
    var res = this.operand.evaluate(this.processValue);
    if (!!this.onComplete) {
      this.onComplete(res, this.id);
    }
    return res;
  }
}

export class ExpressionExecutor implements IExpressionExecutor {
  public static createExpressionExecutor: (expression: string) => IExpressionExecutor =
    (expression: string) => { return new ExpressionExecutor(expression); };
  public static getQuestionErrorText(properties: HashTable<any>): string {
    if (!!properties) {
      const question = properties["question"];
      if (!!question && !!question.name) {
        return " It is used in the question: '" + question.name + "'.";
      }
    }
    return "";
  }
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

  public run(values: HashTable<any>, properties?: HashTable<any>, id?: number): any {
    return this.runContext(new VariableGetterContextEx(values, properties?.context), properties, id);
  }
  public runContext(context: IValueGetterContext, properties: HashTable<any> = null, id: number): any {
    if (!this.operand) {
      if (!!this.expression) {
        ConsoleWarnings.warn("Invalid expression: '" + this.expression + "'." + ExpressionExecutor.getQuestionErrorText(properties));
      }
      return null;
    }
    const runner = new ExpressionExecutorRunner(this.operand, id, this.onComplete, properties, context);
    return runner.run(this.isAsync);
  }
  public validate(context: IValueGetterContext, isCondition: boolean, options: IExpressionValidationOptions): IExpressionError[] {
    let errors: IExpressionError[] = [];
    if (!this.operand) { errors.push({ errorType: ExpressionErrorType.SyntaxError }); return errors; }

    const list = new Array<Operand>();
    this.operand.addOperandsToList(list);

    if (options.semantics && isCondition && list.length == 1 && list[0].getType() === "const" && !(<Const>list[0]).isBoolean()) {
      errors.push({ errorType: ExpressionErrorType.SemanticError });
      return errors;
    }

    const operands = list.reduce((acc, operand) => {
      const type = operand.getType();
      if (!acc[type]) { acc[type] = []; }
      acc[type].push(operand);
      return acc;
    }, {} as { [key: string]: Operand[] });

    if (options.functions) {
      for (const operand of (operands.function || []) as FunctionOperand[]) {
        if (!FunctionFactory.Instance.hasFunction(operand.functionName)) {
          errors.push({ errorType: ExpressionErrorType.UnknownFunction, functionName: operand.functionName });
        }
      }
    }

    if (options.variables) {
      for (const operand of (operands.variable || []) as Variable[]) {
        if (!new ProcessValue(context).hasValue(operand.variable)) {
          errors.push({ errorType: ExpressionErrorType.UnknownVariable, variableName: operand.variable });
        }
      }
    }

    return errors;
  }
}

export class ExpressionRunnerBase {
  private expressionExecutor: IExpressionExecutor;
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
    this.expressionExecutor = ExpressionExecutor.createExpressionExecutor(value);
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

  public hasFunction(): boolean {
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

export class ConditionRunner extends ExpressionRunnerBase {
  public onRunComplete: (result: boolean) => void;
  public runValues(values: HashTable<any>, properties?: HashTable<any>): boolean {
    return this.runContext(new VariableGetterContextEx(values, properties?.context), properties);
  }
  public runContext(context: IValueGetterContext, properties?: HashTable<any>): boolean {
    return this.runContextCore(context, properties) == true;
  }
  protected doOnComplete(res: any, id: number): void {
    if (!!this.onRunComplete)this.onRunComplete(res == true);
    super.doOnComplete(res, id);
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
