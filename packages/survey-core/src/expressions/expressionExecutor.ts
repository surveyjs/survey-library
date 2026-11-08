import { HashTable } from "../helpers";
import { IValueGetterContext, ProcessValue, VariableGetterContextEx } from "../conditions/conditionProcessValue";
import { ConsoleWarnings } from "../console-warnings";
import { Operand, FunctionOperand, AsyncFunctionItem, Variable } from "./expressions";
import { ConditionsParser } from "../conditions/conditionsParser";
import { FunctionFactory } from "../functionsfactory";
import { IExpressionValidationOptions } from "../base";
import { ExpressionErrorType, IExpressionError, getQuestionErrorText } from "./expressionError";
import { setCreateExpressionExecutor } from "./expressionRunner";
import type { ISurveySettings } from "../survey-settings";

export interface IExpressionExecutorBase {
  onComplete: (res: any, id: number) => void;
  expression: string;
  canRun(): boolean;
  run(values: HashTable<any>, properties: HashTable<any>, id: number, settings?: ISurveySettings): any;
  runContext(context: IValueGetterContext, properties: HashTable<any>, id: number, settings?: ISurveySettings): any;
  getVariables(): Array<string>;
  hasFunction(noParamsOnly?: boolean): boolean;
  // The names of the functions the expression calls; an executor without it is treated as calling unknown ones
  getFunctionNames?(): Array<string>;
  isAsync: boolean;
  validate(context: IValueGetterContext, isCondition: boolean, options: IExpressionValidationOptions): IExpressionError[];
}

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
  run(values: HashTable<any>, properties: HashTable<any>, id: number, settings?: ISurveySettings): any;
  runContext(context: IValueGetterContext, properties: HashTable<any>, id: number, settings?: ISurveySettings): any;
  /**
   * Returns the list of variables that used in the expression. They defined as: {variableName} in default parser.
   */
  getVariables(): Array<string>;
  /**
   * Returns true if there is a function in the expression
   */
  hasFunction(noParamsOnly?: boolean): boolean;
  /**
   * Returns true if there is an async function in the expression
   */
  isAsync: boolean;
  validate(context: IValueGetterContext, isCondition: boolean, options: IExpressionValidationOptions): IExpressionError[];
}

export class ExpressionExecutorRunner {
  private processValue: ProcessValue;
  private asyncFuncList: Array<AsyncFunctionItem>;
  constructor(private operand: Operand, private id: number, private onComplete: (res: any, id: number) => void, properties: HashTable<any>, context: IValueGetterContext, settings?: ISurveySettings) {
    this.processValue = new ProcessValue(context);
    this.processValue.properties = properties;
    this.processValue.settings = ExpressionExecutorRunner.getRunSettings(settings, properties, context);
  }
  // Once per run: the explicit settings, else the survey's from the properties, else the survey's of
  // the context object (a text question's min/maxValueExpression runs with no properties at load).
  // undefined means the global settings, also for a survey that sets no key itself (getOwnSettings).
  // Not kept on the operand or the executor: they outlive a run.
  // properties.survey and the context object are untyped and may come from caller code, so the members are checked.
  private static getRunSettings(settings: ISurveySettings, properties: HashTable<any>, context: IValueGetterContext): ISurveySettings {
    if (!!settings) return settings;
    const survey = properties?.survey;
    if (!!survey && typeof survey.getOwnSettings === "function") return survey.getOwnSettings();
    const obj = !!context && typeof context.getObj === "function" ? context.getObj() : undefined;
    const objSurvey = !!obj && typeof obj.getSurvey === "function" ? obj.getSurvey() : undefined;
    return !!objSurvey && typeof objSurvey.getOwnSettings === "function" ? objSurvey.getOwnSettings() : undefined;
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
    return getQuestionErrorText(properties);
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

  public hasFunction(noParamsOnly?: boolean): boolean {
    if (noParamsOnly === true) return !!this.operand && this.operand.hasFunction(true);
    return this.hasFunctionValue;
  }
  public getFunctionNames(): Array<string> {
    const res = new Array<string>();
    if (!this.hasFunctionValue) return res;
    const list = new Array<Operand>();
    this.operand.addOperandsToList(list);
    for (let i = 0; i < list.length; i++) {
      const name = list[i].getType() === "function" ? (<FunctionOperand>list[i]).functionName : undefined;
      if (!!name && res.indexOf(name) < 0) res.push(name);
    }
    return res;
  }
  public get isAsync(): boolean {
    return this.isAsyncValue;
  }

  public canRun(): boolean {
    return !!this.operand;
  }

  public run(values: HashTable<any>, properties?: HashTable<any>, id?: number, settings?: ISurveySettings): any {
    return this.runContext(new VariableGetterContextEx(values, properties?.context), properties, id, settings);
  }
  public runContext(context: IValueGetterContext, properties: HashTable<any> = null, id: number, settings?: ISurveySettings): any {
    if (!this.operand) {
      if (!!this.expression) {
        ConsoleWarnings.warn("Invalid expression: '" + this.expression + "'." + getQuestionErrorText(properties));
      }
      return null;
    }
    const runner = new ExpressionExecutorRunner(this.operand, id, this.onComplete, properties, context, settings);
    return runner.run(this.isAsync);
  }
  public validate(context: IValueGetterContext, isCondition: boolean, options: IExpressionValidationOptions): IExpressionError[] {
    let errors: IExpressionError[] = [];
    if (!this.operand) { errors.push({ errorType: ExpressionErrorType.SyntaxError }); return errors; }

    const list = new Array<Operand>();
    this.operand.addOperandsToList(list);

    if (options.semantics && isCondition) {
      this.operand.addConditionSemanticErrors(errors);
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
      const arrayContextVars = this.getArrayContextVarNames(operands, context);
      for (const operand of (operands.variable || []) as Variable[]) {
        if (!new ProcessValue(context).hasValue(operand.variable) && !arrayContextVars.has(operand.variable)) {
          errors.push({ errorType: ExpressionErrorType.UnknownVariable, variableName: operand.variable });
        }
      }
    }

    return errors;
  }
  private getArrayContextVarNames(operands: { [key: string]: Operand[] }, context: IValueGetterContext): Set<string> {
    const result = new Set<string>();
    const survey = this.getSurveyFromContext(context);
    if (!survey) return result;
    const inArrayFunctions = new Set(["sumInArray", "minInArray", "maxInArray", "countInArray", "avgInArray"]);
    for (const operand of (operands.function || []) as FunctionOperand[]) {
      if (!inArrayFunctions.has(operand.functionName)) continue;
      const params = operand.paramValues;
      if (!params || params.length < 1 || !params[0] || params[0].getType() !== "variable") continue;
      const question = survey.getQuestionByValueName((<Variable>params[0]).variable, true);
      if (!question) continue;
      const templateElements = question.templateElements;
      if (Array.isArray(templateElements)) {
        templateElements.forEach((e: any) => { if (e.name) result.add(e.name); });
      }
      const columns = question.columns;
      if (Array.isArray(columns)) {
        columns.forEach((c: any) => { if (c.name) result.add(c.name); });
      }
    }
    return result;
  }
  private getSurveyFromContext(context: IValueGetterContext): any {
    if (!context || !context.getObj) return null;
    const obj = context.getObj();
    if (!obj) return null;
    if (obj.getQuestionByValueName) return obj;
    return obj.getSurvey ? obj.getSurvey() : null;
  }
}

setCreateExpressionExecutor((expression: string) => new ExpressionExecutor(expression));
