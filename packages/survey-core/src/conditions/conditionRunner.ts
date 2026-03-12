import { HashTable } from "../helpers";
import { IValueGetterContext, VariableGetterContextEx } from "./conditionProcessValue";
import { ExpressionRunnerBase } from "../expressions/expressionRunner";

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