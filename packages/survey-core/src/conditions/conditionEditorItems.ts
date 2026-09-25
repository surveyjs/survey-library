import { Helpers } from "../helpers";
import { settings } from "../settings";
import { ISurvey } from "../interfaces/survey-interfaces";
import { ConditionsParser } from "./conditionsParser";
import { Operand, UnaryOperand, BinaryOperand, Variable, Const, ArrayOperand } from "../expressions/expressions";

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

/* Text to rows, moved from survey-creator-core. The result is all or nothing: an expression the rows
   cannot say - an "or" inside an "and", a function, arithmetic, a negation, a comparison of two
   questions - gives no rows at all. Parentheses leave no node in the parsed tree, so a flat chain of
   "and" and "or" is exactly what the rows can say, and the text built from rows needs no brackets. */
export class ConditionEditorItemsBuilder {
  public static canParseExpression(text: string): boolean {
    if (!text) return true;
    return !!new ConditionsParser().parseExpression(text);
  }
  public static canBuildExpression(text: string): boolean {
    if (!text) return true;
    if (!ConditionEditorItemsBuilder.canParseExpression(text)) return false;
    return new ConditionEditorItemsBuilder().build(text).length > 0;
  }
  // Rows to text. The first row that is not ready ends the text: it is still being filled in.
  public static itemsToExpression(items: Array<ConditionEditorItem>): string {
    let res = "";
    for (let i = 0; i < items.length; i++) {
      if (!items[i].isReady) break;
      if (!!res) {
        res += " " + items[i].conjunction + " ";
      }
      res += items[i].toExpression();
    }
    return res;
  }
  // hasValue tells a name the caller knows: a row that names anything else makes the whole text
  // unbuildable. Creator does not pass it; a Filter Control can pass the names of its fields.
  public constructor(private hasValue: (name: string) => boolean = null) { }
  public build(text: string): Array<ConditionEditorItem> {
    if (!text) return [];
    const operand = new ConditionsParser().parseExpression(text);
    if (!operand) return [];
    return this.buildEditorItems(operand);
  }
  private buildEditorItems(operand: Operand): Array<ConditionEditorItem> {
    let res: Array<ConditionEditorItem> = [];
    if (!this.buildEditorItemsCore(operand, res, "")) {
      res = [];
    }
    return res;
  }
  private buildEditorItemsCore(operand: Operand, res: Array<ConditionEditorItem>, parentConjunction: string): boolean {
    // A "null" or "undefined" literal leaves no operand at all.
    if (!operand) return false;
    if (operand.getType() == "unary") return this.buildEditorItemsAddUnaryOperand(<UnaryOperand>operand, res);
    if (operand.getType() !== "binary") return false;
    const op = <BinaryOperand>operand;
    if (op.isArithmetic && !op.isConjunction) return false;
    if (op.isConjunction) return this.buildEditorItemsAddConjunction(op, res, parentConjunction);
    return this.buildEditorItemsAddBinaryOperand(op, res);
  }
  private buildEditorItemsAddConjunction(op: BinaryOperand, res: Array<ConditionEditorItem>, parentConjunction: string): boolean {
    const conjunction = op.conjunction;
    if (conjunction == "or" && !!parentConjunction && parentConjunction != conjunction) return false;
    if (!this.buildEditorItemsCore(op.leftOperand, res, conjunction)) return false;
    const conjunctionIndex = res.length;
    if (!this.buildEditorItemsCore(op.rightOperand, res, conjunction)) return false;
    res[conjunctionIndex].conjunction = op.conjunction;
    return true;
  }
  private buildEditorItemsAddBinaryOperand(op: BinaryOperand, res: Array<ConditionEditorItem>): boolean {
    const variableOperand = <Variable>this.getOperandByType(op, "variable");
    const arrayValue = this.getArrayValueFromOperand(op);
    const constOperand = !arrayValue ? <Const>this.getOperandByType(op, "const") : null;
    if (!variableOperand || (!constOperand && !arrayValue && this.canShowValueByOperator(op.operator))) return false;
    const isVariableOnRight = op.leftOperand !== variableOperand;
    if (isVariableOnRight && !this.canSwapSides(op.operator)) return false;
    if (!this.isVariableInSurvey(variableOperand.variable)) return false;
    const item = new ConditionEditorItem();
    item.questionName = variableOperand.variable;
    item.operator = isVariableOnRight ? this.getOppositeOperator(op.operator) : op.operator;
    if (!!arrayValue) {
      item.value = arrayValue;
    }
    if (!!constOperand) {
      item.value = constOperand.correctValue;
    }
    res.push(item);
    return true;
  }
  private isVariableInSurvey(variable: string): boolean {
    return !!this.hasValue ? this.hasValue(variable) : true;
  }
  private getArrayValueFromOperand(op: BinaryOperand): Array<any> {
    const arrayOperand = <ArrayOperand>this.getOperandByType(op, "array");
    if (!arrayOperand || !arrayOperand.values) return null;
    const valuesOperand = arrayOperand.values;
    if (!Array.isArray(valuesOperand) || valuesOperand.length == 0) return null;
    const res = [];
    for (let i = 0; i < valuesOperand.length; i++) {
      const opConst = valuesOperand[i];
      if (!opConst) continue;
      if (opConst.getType() != "const") return null;
      res.push((<Const>opConst).correctValue);
    }
    if (res.length == 0) return null;
    return res;
  }
  private buildEditorItemsAddUnaryOperand(op: UnaryOperand, res: Array<ConditionEditorItem>): boolean {
    const operator = op.operator;
    if (operator !== "empty" && operator != "notempty") return false;
    const operand = op.expression;
    if (operand == null || operand.getType() != "variable") return false;
    const questionName = (<Variable>operand).variable;
    if (!this.isVariableInSurvey(questionName)) return false;
    const item = new ConditionEditorItem();
    item.questionName = questionName;
    item.operator = operator;
    res.push(item);
    return true;
  }
  // A row names the question first, so "const op {question}" becomes a row only when swapping the sides
  // keeps the meaning: equality as it is, an ordering operator mirrored by getOppositeOperator.
  // contains, notcontains and allof have no mirror, and anyof / noneof read an empty value differently
  // on each side ("['a'] anyof {q1}" is true for an empty q1, "{q1} anyof ['a']" is false), so such a
  // text stays text. A list of the safe ones: an operator added to the language later stays text too.
  private canSwapSides(operator: string): boolean {
    return ["equal", "notequal", "less", "greater", "lessorequal", "greaterorequal"].indexOf(operator) > -1;
  }
  private getOppositeOperator(operator: string): string {
    if (operator == "less") return "greater";
    if (operator == "greater") return "less";
    if (operator == "lessorequal") return "greaterorequal";
    if (operator == "greaterorequal") return "lessorequal";
    return operator;
  }
  private getOperandByType(op: BinaryOperand, opType: string): Operand {
    // Either side is null for a "null" literal; the Creator original checked the right side only.
    if (!op.leftOperand || !op.rightOperand) return null;
    if (op.leftOperand.getType() !== opType && op.rightOperand.getType() !== opType) return null;
    if (op.leftOperand.getType() == opType && op.rightOperand.getType() == opType) return null;
    return op.leftOperand.getType() == opType ? op.leftOperand : op.rightOperand;
  }
  private canShowValueByOperator(operator: string): boolean {
    return operator != "empty" && operator != "notempty";
  }
}
