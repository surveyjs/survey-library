export class ConsoleWarnings {
  public static disposedObjectChangedProperty(propName: string, objType: string): void {
    ConsoleWarnings.warn("An attempt to set a property \"" + propName + "\" of a disposed object \"" + objType + "\"");
  }
  public static inCorrectQuestionValue(questionName: string, val: any): void {
    const valStr = JSON.stringify(val, null, 3);
    ConsoleWarnings.warn("An attempt to assign an incorrect value" + valStr + " to the following question: \"" + questionName + "\"");
  }
  public static warn(text: string): void {
    // eslint-disable-next-line no-console
    console.warn(text);
  }
  public static error(text: string): void {
    // eslint-disable-next-line no-console
    console.error(text);
  }
}