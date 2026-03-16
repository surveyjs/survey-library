import { HashTable } from "../helpers";

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

export function getQuestionErrorText(properties: HashTable<any>): string {
  if (!!properties) {
    const question = properties["question"];
    if (!!question && !!question.name) {
      return " It is used in the question: '" + question.name + "'.";
    }
  }
  return "";
}