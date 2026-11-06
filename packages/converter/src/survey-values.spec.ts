import { describe, it, expect } from "vitest";
import { ConditionRunner } from "survey-core";
import { formatLiteral } from "./expression";
import { SurveyOperator, surveyEmpty, surveyHolds, surveyLiteral } from "./survey-values";

// A seeded generator, so that every run checks the same cases.
function generator(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

// Values survey-core reads in more than one way: numeric texts with a comma, a sign, hex, leading
// zeros or spaces, boolean texts in any case, quoted texts, and texts that look like operations.
const EDGE_VALUES: unknown[] = [
  "", " ", "0", "00", "01", "1", "1.0", "1,0", "1,5", "1.5", " 1 ", "0x10", "16", "0x", "0.", "0,", ".5", "0.5",
  "-1", "-01", "+1", "1e3", "1000", "10,000", "10", "TRUE", "true", "True", "false", "FALSE", "yes", "undefined",
  "null", "NaN", "Infinity", "'a'", "\"a\"", "a", "A", " a", "ab", "1/2", "2*3", "3-2", "-", "1234567890123456",
  "123456789012345", "0.0", "-0", "1 2", "1,2,3", 0, 1, -1, 1.5, 10, 16, 1000, 0.5, -0.5, true, false, null
];
const CHARS = ["0", "1", "2", "9", ".", ",", "x", "-", "+", "e", " ", "t", "r", "u", "T", "E", "f", "a", "l", "s", "'", "\"", "*", "/"];
const OPERATORS: SurveyOperator[] = ["=", "<>", "<", "<=", ">", ">=", "contains", "notcontains"];

describe("survey-core value model", () => {
  it("agrees with survey-core's ConditionRunner on generated values and literals", () => {
    const random = generator(20241105);
    const pick = <T>(list: T[]): T => list[Math.floor(random() * list.length)];
    const text = () => Array.from({ length: Math.floor(random() * 5) }, () => pick(CHARS)).join("");
    const value = () => (random() < 0.6 ? pick(EDGE_VALUES) : text());
    const mismatches: string[] = [];
    let checked = 0;
    while(checked < 4000) {
      const questionValue = random() < 0.05 ? undefined : value();
      const raw = value();
      const op = pick(OPERATORS);
      const literal = formatLiteral(raw);
      if (literal === undefined) continue;
      checked++;
      const expected = new ConditionRunner(`{q} ${op} ${literal}`).runValues({ q: questionValue });
      const modelled = surveyHolds(op, questionValue, surveyLiteral(raw));
      if (modelled !== expected) mismatches.push(`${JSON.stringify(questionValue)} ${op} ${literal}: survey-core ${expected}`);
    }
    expect(mismatches).toEqual([]);
  });

  it("agrees with survey-core's ConditionRunner on empty and notempty", () => {
    const random = generator(20261105);
    const pick = <T>(list: T[]): T => list[Math.floor(random() * list.length)];
    const text = () => Array.from({ length: Math.floor(random() * 4) }, () => pick(CHARS)).join("");
    const values: unknown[] = [undefined, "''", "\"\"", ...EDGE_VALUES, [], [""], {}, { a: "" }, { a: "''" }, { a: 0 }];
    for (let i = 0; i < 500; i++) values.push(text());
    const mismatches: string[] = [];
    for (const value of values) {
      for (const op of ["empty", "notempty"]) {
        const expected = new ConditionRunner(`{q} ${op}`).runValues({ q: value });
        if ((op === "empty" ? surveyEmpty(value) : !surveyEmpty(value)) !== expected) mismatches.push(`${JSON.stringify(value)} ${op}: survey-core ${expected}`);
      }
    }
    expect(mismatches).toEqual([]);
  });
});
