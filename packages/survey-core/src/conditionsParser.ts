import { Operand, Const } from "./expressions/expressions";
import { PeggySyntaxError, parse } from "./expressions/expressionParser";
import { settings } from "./settings";

export class ConditionsParserError {
  constructor(public at: number, public code: string) {}
}

export class ConditionsParser {
  private conditionError: ConditionsParserError;

  private patchExpression(text: string) {
    text = this.patchBraces(text);
    return text
      .replace(/=>/g, ">=")
      .replace(/=</g, "<=")
      .replace(/<>/g, "!=")
      .replace(/equals/g, "equal ")
      .replace(/notequals/g, "notequal ");
  }
  private patchBraces(text: string): string {
    const start = settings.expressionVariableDelimiters.start;
    const end = settings.expressionVariableDelimiters.end;
    if (start === "{" && end === "}") return text;
    return text.split(start).join("{").split(end).join("}");
  }

  public createCondition(text: string): Operand {
    return this.parseExpression(text);
  }

  public parseExpression(text: string): Operand {
    try {
      return parse(this.patchExpression(text));
    } catch(e) {
      if (e instanceof PeggySyntaxError) {
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
