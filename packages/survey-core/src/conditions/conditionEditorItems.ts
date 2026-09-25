import { Helpers } from "../helpers";
import { settings } from "../settings";
import { ISurvey } from "../interfaces/survey-interfaces";

/* One row of a condition: "{questionName} operator value", joined to the row before it by
   conjunction. Moved from survey-creator-core, where it backs the condition editor; the Filter Control
   edits its items with the same rows. Writing a row back to text keeps the editor's historical rules
   (valToText): Creator's tests pin them. */
export class ConditionEditorItem {
  public conjunction: string = "and";
  public questionName: string;
  public operator: string = settings.logic.defaultOperators.default;
  public value: any;
  public getOperatorText(): string {
    const op = this.operator;
    if (op == "equal") return "=";
    if (op == "notequal") return "<>";
    if (op == "greater") return ">";
    if (op == "less") return "<";
    if (op == "greaterorequal") return ">=";
    if (op == "lessorequal") return "<=";
    return op;
  }
  public getValueText(): string {
    const val = this.value;
    if (!val) return val;
    if (!Array.isArray(val)) return this.valToText(val);
    let res = "[";
    for (let i = 0; i < val.length; i++) {
      res += this.valToText(val[i]);
      if (i < val.length - 1) res += ", ";
    }
    res += "]";
    return res;
  }
  public get isValueRequired(): boolean {
    return this.operator !== "empty" && this.operator !== "notempty";
  }
  public get isReady(): boolean {
    return !!this.questionName && (!this.isValueRequired || !Helpers.isValueEmpty(this.value));
  }
  public toExpression(): string {
    const delimiters = settings.expressionVariableDelimiters;
    let text = delimiters.start + this.getVariableName() + delimiters.end + " " + this.getOperatorText();
    if (this.isValueRequired) {
      text += " " + this.getValueText();
    }
    return text;
  }
  // The variable the text names. A plain row names it by questionName.
  protected getVariableName(): string {
    return this.questionName;
  }
  private valToText(val: any): string {
    if (val == "true" || val == "false") return val;
    if (this.isNumeric(val)) return val;
    if (val[0] == "[") return val.replace(/(?!^)(['])(?!$)/g, "\\$1");
    if (!this.isQuote(val)) val = "'" + val + "'";
    return val.replace(/(?!^)(['"])(?!$)/g, "\\$1");
  }
  private isNumeric(val: any): boolean {
    if (typeof val === "string" && val.length > 1 && val[0] === "0" && val[1] !== "x") return false;
    return !isNaN(val);
  }
  private isQuote(ch: string): boolean {
    return ch == "'" || ch == "\"";
  }
}
// A row of a survey's condition: a question whose valueName differs from its name is named in the text
// by its valueName.
export class SurveyConditionEditorItem extends ConditionEditorItem {
  public constructor(public survey: ISurvey) {
    super();
  }
  protected getVariableName(): string {
    const question = this.survey.getQuestionByName(this.questionName);
    if (question && question.name != question.getValueName() && this.questionName != question.getValueName()) {
      return this.questionName.replace(question.name, question.getValueName());
    }
    return this.questionName;
  }
}
