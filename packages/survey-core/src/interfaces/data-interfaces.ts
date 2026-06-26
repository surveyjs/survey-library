import type { Base } from "../base";
import type { IQuestion } from "../base-interfaces";

export interface ISurveyVariables {
  getVariable(name: string): any;
  setVariable(name: string, newValue: any): void;
}
export interface ISurveyDataGetEditingObj {
  getEditingSurveyElement(): Base;
}
export interface ISurveyData {
  getValue(name: string): any;
  setValue(name: string, newValue: any, locNotification: boolean | "text", allowNotifyValueChanged?: boolean, questionName?: string): any;
  getComment(name: string): string;
  setComment(name: string, newValue: string, locNotification: boolean | "text"): any;
  getFilteredProperties(): any;
  findQuestionByName(name: string): IQuestion;
}
export interface ITextProcessorProp {
  text: string;
  returnDisplayValue?: boolean;
  doEncoding?: boolean;
  runAtDesign?: boolean;
  replaceUndefinedValues?: boolean;
  context?: Base;
}
export interface ITextProcessorResult {
  text: string;
  hasAllValuesOnLastRun: boolean;
}
export interface ITextProcessor {
  processText(text: string, returnDisplayValue: boolean): string;
  processTextEx(params: ITextProcessorProp): ITextProcessorResult;
}
