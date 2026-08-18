import { HashTable } from "../helpers";
import { IValueGetterContext, VariableGetterContextEx } from "../conditions/conditionProcessValue";
import { IExpressionValidationOptions } from "../base";
import { IExpressionError } from "./expressionError";
import type { IExpressionExecutorBase } from "./expressionExecutor";
import { settings } from "../settings";

export { IExpressionExecutorBase };

export var createExpressionExecutor: (expression: string) => IExpressionExecutorBase;
export function setCreateExpressionExecutor(func: (expression: string) => IExpressionExecutorBase): void {
  createExpressionExecutor = func;
}

export class ExpressionRunnerBase {
  private expressionExecutor: IExpressionExecutorBase;
  private variables: string[];
  private containsFunc: boolean;
  private runIdCounter = 0;
  public getRunId: () => number;
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
    this.shareableValue = undefined;
  }

  public getVariables(): Array<string> {
    if (this.variables === undefined) {
      this.variables = this.expressionExecutor.getVariables();
    }
    return this.variables;
  }
  private shareableValue: boolean;
  private shareableSettingsKey: string;
  // The settings calcIsResultShareable() is calculated from are mutable, so the memoized verdict
  // is kept together with their key, the way ExpressionExecutor keeps its parsed trees
  private static getShareableSettingsKey(): string {
    const expVar: any = settings.expressionVariables;
    let res = settings.expressionElementPropertyPrefix;
    for (const key in expVar) {
      res += "\n" + expVar[key];
    }
    return res;
  }
  // The result depends on survey values/variables only: no functions and no variables that are
  // resolved relative to the evaluation context ({item}, {row}, {panel}, ...) or that bypass
  // the value storage ({pageno}, $-property references, ...). For such expressions the result
  // is the same for every element that runs them, so it can be shared (see
  // SurveyModel.getCachedConditionResult).
  public isResultShareable(): boolean {
    const settingsKey = ExpressionRunnerBase.getShareableSettingsKey();
    if (this.shareableValue === undefined || this.shareableSettingsKey !== settingsKey) {
      this.shareableValue = this.calcIsResultShareable();
      this.shareableSettingsKey = settingsKey;
    }
    return this.shareableValue;
  }
  private static builtInVariableNames = ["pageno", "pagecount", "correctedanswers", "correctanswers",
    "correctedanswercount", "incorrectedanswers", "incorrectanswers", "incorrectedanswercount",
    "questioncount", "locale", "length"];
  private calcIsResultShareable(): boolean {
    if (!this.canRun() || this.hasFunction()) return false;
    const vars = this.getVariables();
    if (!Array.isArray(vars)) return false;
    const propPrefix = settings.expressionElementPropertyPrefix;
    const expVar: any = settings.expressionVariables;
    for (let i = 0; i < vars.length; i++) {
      const v = vars[i];
      if (!v) return false;
      if (!!propPrefix && v[0] === propPrefix) return false;
      let first = v;
      const dotIndex = first.indexOf(".");
      if (dotIndex > -1) first = first.substring(0, dotIndex);
      const bracketIndex = first.indexOf("[");
      if (bracketIndex > -1) first = first.substring(0, bracketIndex);
      const firstLower = first.toLowerCase();
      if (ExpressionRunnerBase.builtInVariableNames.indexOf(firstLower) > -1) return false;
      for (const key in expVar) {
        const varName = expVar[key];
        if (!!varName && typeof varName === "string" && varName.toLowerCase() === firstLower) return false;
      }
    }
    return true;
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
    const id = this.getRunId ? this.getRunId() : ++this.runIdCounter;
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
