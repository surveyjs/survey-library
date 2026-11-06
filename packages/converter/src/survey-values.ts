// How survey-core compares a question's value with a literal in a condition such as `{q} = 5`.
//
// The Form.io and JSON Schema converters write a literal only when survey-core's comparison holds
// for exactly the values the source's own comparison holds for, and decide that with this model. The model follows
// survey-core's source (`expressions/expressions.ts`, `helpers.ts`) and does not import it: the
// converter has no runtime dependency. `survey-values.spec.ts` checks it against survey-core's
// `ConditionRunner`, so a change in survey-core shows up there.

// survey-core's number reading of a value (`Helpers.getNumber`, with the default `parseNumber`):
// a text is trimmed, read as hex after `0x`, refused when it holds an operator or more than 15
// digits alone, and read with a single comma as the decimal point.
export function surveyNumber(value: unknown): number {
  let text = value;
  if (typeof text === "string") {
    text = text.trim();
    if (!text) return NaN;
    const s = text as string;
    if (s.indexOf("0x") === 0) return s.length > 32 ? NaN : parseInt(s);
    if (s.length > 15 && /^\d+$/.test(s)) return NaN;
    if (s.lastIndexOf("-") <= 0 && s.lastIndexOf("+") <= 0 && /[*^/%]/.test(s)) return NaN;
    const comma = s.indexOf(",");
    if (comma > -1 && s.indexOf(",", comma + 1) < 0) text = s.replace(",", ".");
  }
  const result = parseFloat(text as string);
  return Number.isNaN(result) || !isFinite(text as number) ? NaN : result;
}

// The value survey-core compares for a question's value in an expression
// (`Variable.getCorrectValue`): a text that reads "true" or "false" in any case is a boolean, a
// quoted text loses its quotes, and a text that reads as a number is that number, unless it starts
// with a 0 that is not `0x`, `0.` or `0,`.
export function surveyVariable(value: unknown): unknown {
  if (!value || typeof value !== "string") return value;
  if (/^(true|false)$/i.test(value)) return value.toLowerCase() === "true";
  if (value.length > 1 && /^['"]/.test(value) && /['"]$/.test(value)) return value.substring(1, value.length - 1);
  const n = surveyNumber(value);
  if (Number.isNaN(n)) return value;
  if (value[0] === "0" && value.indexOf("0x") !== 0) {
    const hasPoint = value.length > 1 && (value[1] === "." || value[1] === ",");
    if ((!hasPoint && value.length > 1) || (hasPoint && value.length < 2)) return value;
  }
  return n;
}

// survey-core's `=` on two values that are not objects (`OperandMaker.isTwoValueEquals`, then
// `Helpers.checkIfValuesEqual` with the default comparator): texts compare trimmed and without
// regard to case, two values that read as numbers compare as numbers, an empty value equals only an
// empty value, a boolean compares with a text as its text, and anything else with JavaScript's `==`.
export function surveyEquals(x: unknown, y: unknown): boolean {
  if (x === "undefined") x = undefined;
  if (y === "undefined") y = undefined;
  if (x === y) return true;
  if ((x === undefined || x === null) && y === "") return true;
  if ((y === undefined || y === null) && x === "") return true;
  if (typeof x === "string" && typeof y === "string") return x.trim().toLowerCase() === y.trim().toLowerCase();
  const convertible = (v: unknown) => v !== undefined && v !== null && !Number.isNaN(Number(v));
  if (convertible(x) && convertible(y) && parseInt(x as string) === parseInt(y as string)
    && parseFloat(x as string) === parseFloat(y as string)) return true;
  const isEmpty = (v: unknown) => !v && v !== 0 && v !== false;
  if (isEmpty(x) !== isEmpty(y)) return false;
  if ((x === true || x === false) && typeof y === "string") return x.toString() === y.toLocaleLowerCase();
  if ((y === true || y === false) && typeof x === "string") return y.toString() === x.toLocaleLowerCase();
  // eslint-disable-next-line eqeqeq
  return x == y;
}

// survey-core's `{q} empty` when the question holds `value` (`undefined` for no value):
// `Helpers.isValueEmpty` on the value as an expression reads it (`surveyVariable`), so no value, the
// empty text, an empty array, or an object whose values are all empty. `notempty` is its negation.
export function surveyEmpty(value: unknown): boolean {
  return isValueEmpty(surveyVariable(value));
}

function isValueEmpty(value: unknown): boolean {
  if (Array.isArray(value)) return value.length === 0;
  if (value && typeof value === "object" && (value as object).constructor === Object) {
    return Object.values(value as Record<string, unknown>).every((v) => isValueEmpty(v));
  }
  return !value && value !== 0 && value !== false;
}

// The operators of a condition on a question's value.
export type SurveyOperator = "=" | "<>" | "<" | "<=" | ">" | ">=" | "contains" | "notcontains";

// The value survey-core reads back from a literal written by `formatLiteral`: a finite number or a
// boolean as it is, a text as that text, `null` as the empty text, and any other value as its text,
// all of which it is written as.
export function surveyLiteral(value: unknown): unknown {
  if (value === null || value === undefined) return "";
  if (typeof value === "number" && !Number.isFinite(value)) return String(value);
  return value;
}

// Whether survey-core's `{q} <op> <literal>` holds when the question holds `value` (`undefined`
// for no value), and the literal reads back as `literal` (see `surveyLiteral`). `<>` is the negation
// of `=`; `<` and `>` compare with JavaScript's operators, and never hold for a missing side; `<=`
// and `>=` hold also when `=` does.
export function surveyHolds(op: SurveyOperator, value: unknown, literal: unknown): boolean {
  const left = value === undefined ? undefined : surveyVariable(value);
  switch(op) {
    case "=": return surveyEquals(left, literal);
    case "<>": return !surveyEquals(left, literal);
    case "<": return surveyOrders(left, literal, true);
    case ">": return surveyOrders(left, literal, false);
    case "<=": return surveyEquals(left, literal) || surveyOrders(left, literal, true);
    case ">=": return surveyEquals(left, literal) || surveyOrders(left, literal, false);
    case "contains": return surveyContains(left, literal, true);
    default:
      // `notcontains` holds for no value against any literal that is not empty.
      if (!left && !isSurveyEmpty(literal)) return true;
      return surveyContains(left, literal, false);
  }
}

function surveyOrders(left: unknown, right: unknown, less: boolean): boolean {
  // eslint-disable-next-line eqeqeq
  if (left == null || right == null) return false;
  return less ? (left as number) < (right as number) : (left as number) > (right as number);
}

// `OperandMaker.binaryFunctions.containsCore`: an empty array contains nothing; another value that
// has no length is read as its text; a text contains a literal as its text, without regard to case;
// an array contains a literal when one of its items equals it.
function surveyContains(left: unknown, right: unknown, isContains: boolean): boolean {
  if (Array.isArray(left) && left.length === 0) return !isContains;
  if (!left && left !== 0 && left !== false) return false;
  let value = left;
  if (!(value as { length?: unknown }).length) value = String(value);
  if (typeof value === "string") {
    if (!right) return false;
    const found = value.toLowerCase().indexOf(String(right).toLowerCase()) > -1;
    return isContains ? found : !found;
  }
  const items = value as unknown[];
  const found = items.some((item) => surveyEquals(item, right));
  return isContains ? found : !found;
}

// `Helpers.isValueEmpty` on a literal: no value, the empty text, or an empty array.
function isSurveyEmpty(value: unknown): boolean {
  if (Array.isArray(value)) return value.length === 0;
  return !value && value !== 0 && value !== false;
}
