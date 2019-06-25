import { Operand } from "./expressions/expressions";
import { SyntaxError, parse } from "./expressions/expressionParser";

export class ConditionsParserError {
  constructor(public at: number, public code: string) {}
}

export class ConditionsParser {
  private conditionError: ConditionsParserError;

  private patchExpression(text: string) {
    return text
      .replace(/=>/g, ">=")
      .replace(/=</g, "<=")
      .replace(/<>/g, "!=")
      .replace(/==/g, "= ")
      .replace(/equals/g, "equal ")
      .replace(/notequals/g, "notequal ");
  }

  public createCondition(text: string): Operand {
    return this.parseExpression(text);
  }

  public parseExpression(text: string): Operand {
    try {
      return parse(this.patchExpression(text));
    } catch (e) {
      if (e instanceof SyntaxError) {
        this.conditionError = new ConditionsParserError(
          e.location.start.offset,
          e.message
        );
      }
    }
  }

  public get error(): ConditionsParserError {
    return this.conditionError;
  }
}
