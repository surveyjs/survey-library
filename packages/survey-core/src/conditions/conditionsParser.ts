import { Operand } from "../expressions/expressions";
import { ExpressionSyntaxError, parse } from "../expressions/expressionParserCore";
import { settings } from "../settings";

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
    if (start === end) {
      const parts = text.split(start);
      let result = parts[0];
      for (let i = 1; i < parts.length; i++) {
        result += (i % 2 === 1 ? "{" : "}") + parts[i];
      }
      return result;
    }
    return text.split(start).join("{").split(end).join("}");
  }

  public createCondition(text: string): Operand {
    return this.parseExpression(text);
  }

  public parseExpression(text: string): Operand {
    this.conditionError = undefined;
    try {
      return parse(this.patchExpression(text));
    } catch(e) {
      if (e instanceof ExpressionSyntaxError) {
        this.conditionError = new ConditionsParserError(
          e.location.start.offset,
          e.message
        );
      } else if (e instanceof RangeError) {
        // The parser is recursive: nesting deeper than the stack allows overflows it.
        // There is no position to report, and the linter shows none for an undefined "at".
        this.conditionError = new ConditionsParserError(undefined, "The expression is nested too deeply to parse.");
      }
    }
  }

  public get error(): ConditionsParserError {
    return this.conditionError;
  }
}
