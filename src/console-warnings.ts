export class ConsoleWarnings {
  public static disposedObjectChangedProperty(propName: string, objType: string): void {
    ConsoleWarnings.warn("Attempt to set property '" + propName + "' of a disposed object '" + objType + "'");
  }
  public static inCorrectQuestionValue(questionName: string, val: any): void {
    const valStr = JSON.stringify(val, null, 3);
    ConsoleWarnings.warn("Try to set incorrect value into question. Question name: '" + questionName + "', value: " + valStr);
  }
  public static warn(text: string): void {
    // eslint-disable-next-line no-console
    console.warn(text);
  }
}