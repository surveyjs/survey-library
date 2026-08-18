import { HashTable } from "../helpers";
import { IValueGetterContext, ProcessValue, VariableGetterContextEx } from "../conditions/conditionProcessValue";
import { ConsoleWarnings } from "../console-warnings";
import { Operand, FunctionOperand, AsyncFunctionItem, Variable } from "./expressions";
import { ConditionsParser } from "../conditions/conditionsParser";
import { FunctionFactory } from "../functionsfactory";
import { IExpressionValidationOptions } from "../base";
import { ExpressionErrorType, IExpressionError, getQuestionErrorText } from "./expressionError";
import { setCreateExpressionExecutor } from "./expressionRunner";
import { settings } from "../settings";

export interface IExpressionExecutorBase {
  onComplete: (res: any, id: number) => void;
  expression: string;
  canRun(): boolean;
  run(values: HashTable<any>, properties: HashTable<any>, id: number): any;
  runContext(context: IValueGetterContext, properties: HashTable<any>, id: number): any;
  getVariables(): Array<string>;
  hasFunction(noParamsOnly?: boolean): boolean;
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
  run(values: HashTable<any>, properties: HashTable<any>, id: number): any;
  runContext(context: IValueGetterContext, properties: HashTable<any>, id: number): any;
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
    return getQuestionErrorText(properties);
  }
  public onComplete: (res: any, id: number) => void;
  private expressionValue: string;
  private operand: Operand;
  private parser = new ConditionsParser();
  private isAsyncValue: boolean = false;
  private isAsyncFuncVersion: number = -1;
  private hasFunctionValue: boolean = false;
  /* Parsed expression trees are shared between executors: identical expression strings are
     common (the same visibleIf/choicesEnableIf repeated across questions) and parsing is
     expensive. Operand trees are treated as immutable after parsing. hasFunction is structural
     and can be cached; isAsync depends on the function registry, which an application can change
     at any moment, so it is recalculated whenever the registry version has moved on. The settings
     below are read while parsing, so a cached tree becomes obsolete when any of them is changed. */
  private static parsedExpressions = new Map<string, { operand: Operand, hasFunction: boolean, settingsKey: string }>();
  private static maxParsedExpressions = 10000;
  /* An expression editor produces a new intermediate string on every keystroke, so a full cache
     must not be emptied and must not let those strings push out the trees a live survey uses.
     A string is admitted into a full cache only on its second request - the first one is merely
     remembered in the ring below - and then the least recently used entry is dropped. Evicting an
     entry never breaks anything: an executor keeps its own reference to the operand tree. */
  private static recentExpressions: Array<string> = [];
  private static maxRecentExpressions = 1000;
  private static getParseSettingsKey(): string {
    const delimiters = settings.expressionVariableDelimiters;
    return settings.expressionDisableConversionChar + "\n" + delimiters.start + "\n" + delimiters.end;
  }
  private static addParsedExpression(value: string, parsed: { operand: Operand, hasFunction: boolean, settingsKey: string }): void {
    const cache = ExpressionExecutor.parsedExpressions;
    if (cache.size < ExpressionExecutor.maxParsedExpressions) {
      cache.set(value, parsed);
      return;
    }
    const recent = ExpressionExecutor.recentExpressions;
    const recentIndex = recent.indexOf(value);
    if (recentIndex < 0) {
      recent.push(value);
      if (recent.length > ExpressionExecutor.maxRecentExpressions) {
        recent.shift();
      }
      return;
    }
    recent.splice(recentIndex, 1);
    // Map iterates in insertion order and a cache hit re-inserts the entry, so the first key is
    // the least recently used one
    const lruKey = cache.keys().next();
    if (!lruKey.done) {
      cache.delete(lruKey.value);
    }
    cache.set(value, parsed);
  }
  constructor(expression: string) {
    this.setExpression(expression);
  }
  public get expression(): string {
    return this.expressionValue;
  }
  private setExpression(value: string): void {
    if (this.expression === value) return;
    this.expressionValue = value;
    const cache = ExpressionExecutor.parsedExpressions;
    const settingsKey = ExpressionExecutor.getParseSettingsKey();
    let parsed = cache.get(value);
    if (parsed === undefined || parsed.settingsKey !== settingsKey) {
      const operand = this.parser.parseExpression(value) || null;
      parsed = { operand: operand, hasFunction: !!operand ? operand.hasFunction() : false, settingsKey: settingsKey };
      cache.delete(value);
      ExpressionExecutor.addParsedExpression(value, parsed);
    } else {
      // re-insert to mark the entry as the most recently used one
      cache.delete(value);
      cache.set(value, parsed);
    }
    this.operand = parsed.operand;
    this.hasFunctionValue = parsed.hasFunction;
    this.isAsyncFuncVersion = -1;
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
  public get isAsync(): boolean {
    // an executor outlives the registration of the functions it calls: runners are cached per
    // property (Base.getExpressionInfoByProperty, QuestionSelectBase.getChoicesCondition) and
    // an application can re-register a function as async after the first run
    const version = FunctionFactory.Instance.version;
    if (this.isAsyncFuncVersion !== version) {
      this.isAsyncValue = this.hasFunctionValue ? this.operand.hasAsyncFunction() : false;
      this.isAsyncFuncVersion = version;
    }
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
        ConsoleWarnings.warn("Invalid expression: '" + this.expression + "'." + getQuestionErrorText(properties));
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
      if (!params || params.length < 1 || params[0].getType() !== "variable") continue;
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
