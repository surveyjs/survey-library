import { HashTable } from "../helpers";
import { IValueGetterContext, VariableGetterContextEx } from "./conditionProcessValue";
import { ExpressionRunnerBase } from "../expressions/expressionRunner";
import type { ISurveySettings } from "../survey-settings";

export class ConditionRunner extends ExpressionRunnerBase {
  public onRunComplete: (result: boolean) => void;
  public runValues(values: HashTable<any>, properties?: HashTable<any>, settings?: ISurveySettings): boolean {
    return this.runContext(new VariableGetterContextEx(values, properties?.context), properties, settings);
  }
  public runContext(context: IValueGetterContext, properties?: HashTable<any>, settings?: ISurveySettings): boolean {
    return this.runContextCore(context, properties, settings) == true;
  }
  protected doOnComplete(res: any, id: number): void {
    try {
      if (!!this.onRunComplete)this.onRunComplete(res == true);
    } finally {
      super.doOnComplete(res, id);
    }
  }
}