export class Logger {
  private _result = "";
  public log(action: string) {
    this._result += "->" + action;
  }
  public get result() {
    return this._result;
  }
}
